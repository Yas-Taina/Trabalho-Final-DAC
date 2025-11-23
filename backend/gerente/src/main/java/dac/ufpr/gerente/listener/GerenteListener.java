package dac.ufpr.gerente.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import dac.ufpr.gerente.dto.GerenteDto;
import dac.ufpr.gerente.dto.ContaReassignDto;
import dac.ufpr.gerente.enums.EnStatusIntegracao;
import dac.ufpr.gerente.exception.mapper.ExceptionMapper;
import dac.ufpr.gerente.listener.dto.SagaMessage;
import dac.ufpr.gerente.service.GerenteService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;
import static dac.ufpr.gerente.config.RabbitMqConfig.GERENTE_CREATE_QUEUE;
import static dac.ufpr.gerente.config.RabbitMqConfig.SAGA_RESPONSE_QUEUE;
import static dac.ufpr.gerente.config.RabbitMqConfig.CONTA_REASSIGN_QUEUE;

@Component
@RequiredArgsConstructor
public class GerenteListener {

	private final Logger log = LoggerFactory.getLogger(GerenteListener.class);

	private final GerenteService service;
	private final RabbitTemplate rabbitTemplate;
	private final ObjectMapper objectMapper;

	@RabbitListener(queues = GERENTE_CREATE_QUEUE)
	public void listen(SagaMessage<?> message) {
		log.info("Mensagem recebida para tópico: {}. Payload: {}", GERENTE_CREATE_QUEUE, message);

		try {
			// Convert LinkedHashMap to GerenteDto
			GerenteDto gerenteDto = objectMapper.convertValue(message.getData(), GerenteDto.class);
			GerenteDto dto = service.criar(gerenteDto);

			SagaMessage<GerenteDto> response = new SagaMessage<>(
					message.getSagaId(),
					GERENTE_CREATE_QUEUE,
					EnStatusIntegracao.SUCESSO,
					null,
					dto);

			rabbitTemplate.convertAndSend(SAGA_RESPONSE_QUEUE, response);

			// After successfully creating gerente, initiate conta reassignment
			log.info("Gerente criado com sucesso. Iniciando saga de reassignment. CPF: {}", dto.cpf());
			ContaReassignDto reassignDto = new ContaReassignDto();
			reassignDto.setNovoGerenteCpf(dto.cpf());
			
			SagaMessage<ContaReassignDto> reassignMessage = new SagaMessage<>(
					message.getSagaId(),
					"GERENTE_CREATED",
					EnStatusIntegracao.SUCESSO,
					null,
					reassignDto);
			rabbitTemplate.convertAndSend(CONTA_REASSIGN_QUEUE, reassignMessage);

		} catch (Exception e) {
			log.error("Erro ao processar a mensagem para o tópico: {}. Erro: ", GERENTE_CREATE_QUEUE, e);

			SagaMessage<?> errorResponse = ExceptionMapper.mapExceptionToSagaMessage(
					message.getSagaId(),
					GERENTE_CREATE_QUEUE,
					message.getData(),
					e);

			rabbitTemplate.convertAndSend(SAGA_RESPONSE_QUEUE, errorResponse);
		}
	}
}
