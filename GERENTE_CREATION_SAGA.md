# Gerente Creation Saga - RabbitMQ Structure

## Overview
This saga handles the process of creating a new gerente and automatically reassigning a conta and its associated cliente to the newly created gerente.

## Saga Flow

```
1. Gerente Creation (GerenteListener)
   ↓
2. Gerente Created → Saga Initiated (GerenteCreationSagaListener)
   ↓
3. Find Conta & Reassign to New Gerente (ContaReassignListener)
   ↓
4. Get ClienteId from Reassigned Conta
   ↓
5. Reassign Cliente to New Gerente (ClienteReassignListener)
   ↓
6. Saga Completion (SagaGerenteCreationListener)
```

## Queue Structure

### Queues
- `gerente.create.queue` - Gerente creation requests
- `saga.gerente.creation.queue` - Saga orchestration messages
- `conta.reassign.queue` - Conta reassignment requests
- `cliente.reassign.queue` - Cliente reassignment requests

## Components

### 1. Gerente Service
**File**: `backend/gerente/src/main/java/dac/ufpr/gerente/listener/GerenteListener.java`
- **Listens to**: `gerente.create.queue`
- **Sends to**: `saga.gerente.creation.queue`
- **Responsibility**: Creates gerente and initiates reassignment saga

**File**: `backend/gerente/src/main/java/dac/ufpr/gerente/listener/GerenteCreationSagaListener.java`
- **Listens to**: `saga.gerente.creation.queue`
- **Sends to**: `conta.reassign.queue`
- **Responsibility**: Receives gerente creation confirmation and requests conta reassignment

### 2. Conta Service
**File**: `backend/conta/src/main/java/dac/ufpr/conta/messaging/ContaReassignListener.java`
- **Listens to**: `conta.reassign.queue`
- **Sends to**: `cliente.reassign.queue`
- **Responsibility**: 
  - Finds a conta that should be reassigned to the new gerente
  - Reassigns the conta to the new gerente
  - Retrieves the clienteId associated with that conta
  - Forwards the clienteId to cliente service

### 3. Cliente Service
**File**: `backend/cliente/src/main/java/dac/ufpr/cliente/listener/ClienteReassignListener.java`
- **Listens to**: `cliente.reassign.queue`
- **Sends to**: `saga.gerente.creation.queue`
- **Responsibility**: 
  - Reassigns the cliente to the new gerente
  - Sends success/failure status back to saga

### 4. Saga Service (Orchestrator)
**File**: `backend/Saga/src/main/java/dac/ufpr/Saga/listener/SagaGerenteCreationListener.java`
- **Listens to**: `saga.gerente.creation.queue`
- **Responsibility**: 
  - Monitors saga progress
  - Handles success completion
  - Implements compensation logic on failure

**File**: `backend/Saga/src/main/java/dac/ufpr/Saga/service/SagaService.java`
- **Method**: `iniciarSagaGerenteCreation()`
- **Responsibility**: Entry point to manually initiate saga (if needed)

## Message Flow

### Step 1: Gerente Creation
```json
{
  "sagaId": "uuid",
  "step": "GERENTE_CREATE_QUEUE",
  "status": "SUCESSO",
  "error": null,
  "data": {
    "cpf": "12345678900",
    "nome": "João Silva",
    "email": "joao@example.com",
    "tipo": "GERENTE"
  }
}
```

### Step 2: Initiate Reassignment
```json
{
  "sagaId": "uuid",
  "step": "GERENTE_CREATED",
  "status": "SUCESSO",
  "error": null,
  "data": {
    "contaId": null,
    "novoGerenteCpf": "12345678900"
  }
}
```

### Step 3: Conta Reassigned
```json
{
  "sagaId": "uuid",
  "step": "CONTA_REASSIGNED",
  "status": "SUCESSO",
  "error": null,
  "data": {
    "clienteId": 123,
    "novoGerenteCpf": "12345678900"
  }
}
```

### Step 4: Cliente Reassigned
```json
{
  "sagaId": "uuid",
  "step": "CLIENTE_REASSIGNED",
  "status": "SUCESSO",
  "error": null,
  "data": {
    "clienteId": 123,
    "novoGerenteCpf": "12345678900"
  }
}
```

## DTOs

### ContaReassignDto
```java
{
  Long contaId;
  String novoGerenteCpf;
}
```

### ClienteReassignDto
```java
{
  Long clienteId;
  String novoGerenteCpf;
}
```

## Implementation Tasks

### ContaService
You need to implement the following methods in `ContaService`:

```java
/**
 * Finds a conta that should be reassigned to a new gerente.
 * Logic: Find conta from gerente with most contas (to balance load)
 */
public Long findContaToReassign() {
    // TODO: Implement logic to find conta
    // Example: Find gerente with most contas and get one conta from them
    // SELECT conta_id FROM conta 
    // WHERE gerente_cpf = (
    //   SELECT gerente_cpf FROM conta 
    //   GROUP BY gerente_cpf 
    //   ORDER BY COUNT(*) DESC 
    //   LIMIT 1
    // )
    // LIMIT 1
}

/**
 * Reassigns a conta to a new gerente.
 * This should be called AFTER finding the conta and BEFORE getting the clienteId.
 */
public void reassignConta(Long contaId, String novoGerenteCpf) {
    // TODO: Implement logic to update conta's gerente
    // Example: UPDATE conta SET gerente_cpf = novoGerenteCpf WHERE id = contaId
}

/**
 * Gets the clienteId associated with a conta.
 */
public Long getClienteIdByContaId(Long contaId) {
    // TODO: Implement logic to get clienteId from conta
    // Example: SELECT cliente_id FROM conta WHERE id = contaId
}
```

### ClienteService
You need to implement the following method in `ClienteService`:

```java
/**
 * Reassigns a cliente to a new gerente.
 */
public void reassignClienteToGerente(Long clienteId, String novoGerenteCpf) {
    // TODO: Implement logic to update cliente's gerente
    // Example: UPDATE cliente SET gerente_cpf = novoGerenteCpf WHERE id = clienteId
}
```

## Error Handling

The saga includes error handling at each step:
- If conta reassignment fails → Error sent back to saga orchestrator
- If cliente reassignment fails → Error sent back to saga orchestrator
- Saga orchestrator logs errors and can implement compensation logic

## Compensation Logic (TODO)

In case of failure, you may need to implement compensation:
- If cliente reassignment fails after conta was reassigned → Rollback conta reassignment
- If saga fails → Potentially delete the created gerente (depending on business rules)

## Testing the Saga

1. Create a gerente via the gerente creation endpoint
2. Watch the logs to see the saga progress through each step
3. Verify that a conta and cliente were reassigned to the new gerente

## Notes

- The saga uses the same `SagaMessage` structure as other sagas in the system
- All queues are configured in their respective `RabbitMqConfig` classes
- The saga is initiated automatically after gerente creation
- You can also manually initiate the saga using `SagaService.iniciarSagaGerenteCreation()`
