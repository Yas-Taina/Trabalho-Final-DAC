package dac.ufpr.gerente.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import dac.ufpr.gerente.dto.GerenteDto;
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
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.Map;

import static dac.ufpr.gerente.config.RabbitMqConfig.*;

@Component
@RequiredArgsConstructor
public class GerenteUpdateListener {

	private final Logger log = LoggerFactory.getLogger(GerenteUpdateListener.class);

	private final GerenteService service;
	private final RabbitTemplate rabbitTemplate;
	private final ObjectMapper objectMapper;

	@RabbitListener(queues = GERENTE_UPDATE_QUEUE)
	public void listen(SagaMessage<?> message) {
		log.info("Mensagem recebida para tópico: {}. Payload: {}", GERENTE_UPDATE_QUEUE, message);

		try {
			GerenteDto gerenteDto = objectMapper.convertValue(message.getData(), GerenteDto.class);
			
			log.info("Atualizando gerente com CPF: {}", gerenteDto.cpf());
			
			// Update gerente (without password)
			GerenteDto dto = service.atualizar(gerenteDto.cpf(), gerenteDto);
			log.info("Gerente atualizado com sucesso. CPF: {}", dto.cpf());

			if (StringUtils.hasText(gerenteDto.senha()) || StringUtils.hasText(gerenteDto.email())) {
				log.info("Senha ou email fornecido. Enviando solicitação de atualização para Auth. CPF: {}", gerenteDto.cpf());
				
				Map<String, Object> authData = new HashMap<>();
				authData.put("cpf", gerenteDto.cpf());
				authData.put("email", gerenteDto.email());
				authData.put("senha", gerenteDto.senha());
				
				SagaMessage<Map<String, Object>> authMessage = new SagaMessage<>(
						message.getSagaId(),
						"GERENTE_UPDATED",
						EnStatusIntegracao.SUCESSO,
						null,
						authData);
				
				rabbitTemplate.convertAndSend(AUTH_UPDATE_QUEUE, authMessage);
				log.info("Solicitação de atualização de credenciais enviada para Auth. CPF: {}", gerenteDto.cpf());
			} else {
				log.info("Nenhuma senha ou email fornecido. Pulando atualização de credenciais. CPF: {}", gerenteDto.cpf());
				
				// Send success response immediately if no password update needed
				SagaMessage<GerenteDto> response = new SagaMessage<>(
						message.getSagaId(),
						GERENTE_UPDATE_QUEUE,
						EnStatusIntegracao.SUCESSO,
						null,
						dto);

				rabbitTemplate.convertAndSend(SAGA_RESPONSE_QUEUE, response);
			}

		} catch (Exception e) {
			log.error("Erro ao processar a mensagem para o tópico: {}. Erro: ", GERENTE_UPDATE_QUEUE, e);

			SagaMessage<?> errorResponse = ExceptionMapper.mapExceptionToSagaMessage(
					message.getSagaId(),
					GERENTE_UPDATE_QUEUE,
					message.getData(),
					e);

			rabbitTemplate.convertAndSend(SAGA_RESPONSE_QUEUE, errorResponse);
		}
	}
}
