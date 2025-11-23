package dac.ufpr.cliente.service;

import dac.ufpr.cliente.config.EmailService;
import dac.ufpr.cliente.dto.ClienteDto;
import dac.ufpr.cliente.entity.Cliente;
import dac.ufpr.cliente.enums.EnFiltroCliente;
import dac.ufpr.cliente.enums.EnStatusCliente;
import dac.ufpr.cliente.exception.custom.BadRequestException;
import dac.ufpr.cliente.exception.custom.ResourceAlreadyExistsException;
import dac.ufpr.cliente.exception.custom.ResourceNotFoundException;
import dac.ufpr.cliente.mapper.ClienteMapper;
import dac.ufpr.cliente.repository.ClienteRepository;
import dac.ufpr.cliente.security.utils.JwtExtractor;
import lombok.RequiredArgsConstructor;
import org.apache.commons.collections4.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.core.io.ClassPathResource;

import javax.print.DocFlavor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.regex.Pattern;
import java.nio.charset.StandardCharsets;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ClienteService {

	private static final Logger log = LoggerFactory.getLogger(ClienteService.class);

	private static final Pattern CPF_PATTERN = Pattern.compile("\\d{11}");
	private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
	private static final Pattern TELEFONE_PATTERN = Pattern.compile("\\d{10,11}");
	private static final Pattern CEP_PATTERN = Pattern.compile("\\d{8}");

	private final ClienteRepository repository;
	private final JwtExtractor jwtExtractor;
	private final JdbcTemplate jdbcTemplate;
	private final EmailService emailService;

	public List<ClienteDto> listar(String filtro) {

		var authenticatedUserId = jwtExtractor.getAuthenticatedCpf().orElse("");
		var authenticatedUserType = jwtExtractor.getAuthenticatedRole().orElse("");

		var clientesStream = repository.findAll().stream();

		if (authenticatedUserType.equals("GERENTE")) {
			clientesStream = clientesStream
				.filter(c -> c.getCpf_gerente().equals(authenticatedUserId));
		}

		if ((filtro == null || filtro.isBlank())) {
			return clientesStream
				.sorted((c1, c2) -> c1.getNome().compareTo(c2.getNome()))
				.map(ClienteMapper::toDto)
				.toList();
		}

		if (EnFiltroCliente.PARA_APROVAR.equals(filtro)) {
			clientesStream = clientesStream
				.filter(c -> Objects.equals(c.getStatus(), EnStatusCliente.PENDENTE))
				.sorted((c1, c2) -> c1.getNome().compareTo(c2.getNome()));
		} else if (EnFiltroCliente.ADM_RELATORIO_CLIENTES.equals(filtro)) {
			clientesStream = clientesStream
				.filter(c -> Objects.equals(c.getStatus(), EnStatusCliente.APROVADO))
				.sorted((c1, c2) -> c1.getNome().compareTo(c2.getNome()));
		}
		// TODO: esse filtro vai existir no gateway, precisa de composition para ver saldo
		// else if (EnFiltroCliente.MELHORES_CLIENTES.equals(filtro)) {
		// 	clientesStream = clientesStream
		// 		.filter(c -> Objects.equals(c.getStatus(), EnStatusCliente.APROVADO))
		// 		.sorted((c1, c2) -> c2.getSalario().compareTo(c1.getSalario()))
		// 		.limit(3);
		// }

		return clientesStream
				.map(ClienteMapper::toDto)
				.toList();
	}

	public ClienteDto consultarPorCpf(String cpf) {
		return repository.findByCpf(cpf)
				.map(ClienteMapper::toDto)
				.orElseThrow(() -> new ResourceNotFoundException("Usuário"));
	}

	public ClienteDto criar(ClienteDto dto) {
		log.info("Criando cliente: {}", dto);
		ClienteDto clienteDto = normalizarDados(dto);

		validarCliente(clienteDto, -1L);

		Cliente cliente = repository.save(ClienteMapper.toEntity(clienteDto));
		log.info("Cliente criado com sucesso: {}", cliente);

		return ClienteMapper.toDto(cliente);
	}

	public ClienteDto atualizar(String cpf, ClienteDto dto) {
		log.info("Atualizando cliente com cpf: {}. Dados do cliente: {}", cpf, dto);
		ClienteDto clienteDto = normalizarDados(dto);

		Cliente clienteExistente = repository.findByCpf(cpf)
				.orElseThrow(() -> new ResourceNotFoundException("Usuário"));

		validarCliente(clienteDto, clienteExistente.getId());

		ClienteMapper.updateEntityFromDto(clienteDto, clienteExistente);

		Cliente clienteAtualizado = repository.save(clienteExistente);
		log.info("Cliente atualizado com sucesso: {}", clienteAtualizado);

		return ClienteMapper.toDto(clienteAtualizado);
	}

	public void deletar(String cpf) {
		log.info("Deletando cliente com CPF: {}", cpf);

		Cliente cliente = repository.findByCpf(cpf)
				.orElseThrow(() -> new ResourceNotFoundException("Usuário"));

		repository.delete(cliente);
		log.info("Cliente deletado com sucesso: {}", cliente);
	}

	public ClienteDto atualizarStatusParaPendente(String cpf) {
		log.info("Atualizando status do cliente para PENDENTE, CPF: {}", cpf);

		Cliente cliente = repository.findByCpf(cpf)
				.orElseThrow(() -> new ResourceNotFoundException("Usuário"));

		cliente.setStatus(EnStatusCliente.PENDENTE);
		cliente.setData_alteracao(LocalDateTime.now());

		repository.save(cliente);
		log.info("Status do cliente atualizado para PENDENTE com sucesso: {}", cliente);
		return ClienteMapper.toDto(cliente);
	}

	public ClienteDto aprovarCliente(String cpf) {
		log.info("Aprovando cliente com CPF: {}", cpf);

		Cliente cliente = repository.findByCpf(cpf)
				.orElseThrow(() -> new ResourceNotFoundException("Usuário"));

		if (EnStatusCliente.APROVADO.equals(cliente.getStatus())) {
			return ClienteMapper.toDto(cliente);
		}

		cliente.setStatus(EnStatusCliente.APROVADO);
		cliente.setData_alteracao(LocalDateTime.now());

		repository.save(cliente);
		log.info("Cliente aprovado com sucesso: {}", cliente);
		return ClienteMapper.toDto(cliente);
	}

	public String rejeitarCliente(String cpf, String motivo) {
		log.info("Reprovando cliente com CPF: {}", cpf);

		Cliente cliente = repository.findByCpf(cpf)
				.orElseThrow(() -> new ResourceNotFoundException("Usuário"));

		cliente.setStatus(EnStatusCliente.REJEITADO);
		cliente.setMotivoRejeicao(motivo);
		cliente.setData_alteracao(LocalDateTime.now());

		repository.save(cliente);
		try {
			var vars = new java.util.HashMap<String, Object>();
			vars.put("nome", cliente.getNome());
			vars.put("motivo", motivo);
			emailService.enviarEmailComTemplate(
					cliente.getEmail(),
					"Rejeição do seu cadastro no BANTADS",
					"email-rejeicao-cliente",
					vars);
		} catch (Exception e) {
			log.error("Erro ao enviar email de rejeição para {}: {}", cliente.getEmail(), e.getMessage());
		}
		log.info("Cliente rejeitado com sucesso: {}", cliente);
		return "Cliente rejeitado com sucesso";
	}

	private void validarCliente(ClienteDto clienteDto, long id) {
		List<String> erros = validarDados(clienteDto);
		if (CollectionUtils.isNotEmpty(erros)) {
			throw new BadRequestException("Dados inválidos: " + String.join("; ", erros));
		}

		if (repository.existsByCpfAndIdNot(clienteDto.cpf(), id)) {
			throw new ResourceAlreadyExistsException("Cliente já cadastrado ou aguardando aprovação, CPF duplicado.");
		}
	}

	public static List<String> validarDados(ClienteDto clienteDto) {
		List<String> erros = new ArrayList<>();

		if (!StringUtils.hasText(clienteDto.nome())) {
			erros.add("Nome é obrigatório");
		}

		if (!StringUtils.hasText(clienteDto.cpf()) || !CPF_PATTERN.matcher(clienteDto.cpf()).matches()) {
			erros.add("CPF inválido. Deve conter 11 números");
		}

		if (!StringUtils.hasText(clienteDto.email()) || !EMAIL_PATTERN.matcher(clienteDto.email()).matches()) {
			erros.add("Email inválido. Ex: exemplo@email.com");
		}

		if (!StringUtils.hasText(clienteDto.telefone()) || !TELEFONE_PATTERN.matcher(clienteDto.telefone()).matches()) {
			erros.add("Telefone inválido. Deve conter 10 ou 11 números");
		}

		if (clienteDto.salario() == null || clienteDto.salario().compareTo(BigDecimal.ZERO) < 0) {
			erros.add("Salário inválido");
		}

		if (!StringUtils.hasText(clienteDto.endereco())) {
			erros.add("Endereço é obrigatório");
		}

		if (!StringUtils.hasText(clienteDto.CEP()) || !CEP_PATTERN.matcher(clienteDto.CEP()).matches()) {
			erros.add("CEP inválido. Deve conter 8 números");
		}

		if (!StringUtils.hasText(clienteDto.cidade())) {
			erros.add("Cidade é obrigatória");
		}

		if (!StringUtils.hasText(clienteDto.estado())) {
			erros.add("Estado é obrigatório");
		}

		return erros;
	}

	private ClienteDto normalizarDados(ClienteDto dto) {
		if (dto == null)
			return null;

		String cpf = dto.cpf() != null ? dto.cpf().replaceAll("\\D", "") : null;
		String telefone = dto.telefone() != null ? dto.telefone().replaceAll("\\D", "") : null;
		String cep = dto.CEP() != null ? dto.CEP().replaceAll("\\D", "") : null;

		return new ClienteDto(
				dto.id(),
				cpf,
				dto.email() != null ? dto.email().trim() : null,
				dto.nome() != null ? dto.nome().trim() : null,
				telefone,
				dto.salario(),
				dto.endereco() != null ? dto.endereco().trim() : null,
				cep,
				dto.cidade() != null ? dto.cidade().trim() : null,
				dto.estado() != null ? dto.estado().trim() : null,
				null,
				null,
				dto.cpf_gerente());
	}

	@Transactional
	public void reboot() {
		try {
			// Lê o arquivo SQL do classpath
			ClassPathResource resource = new ClassPathResource("db/changelog/scripts/V2__insert_default_data.sql");
			String sql = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
			
			// Processa o SQL removendo comentários e dividindo em statements
			StringBuilder currentStatement = new StringBuilder();
			String[] lines = sql.split("\n");
			
			for (String line : lines) {
				// Remove comentários de linha
				int commentIndex = line.indexOf("--");
				String processedLine = commentIndex >= 0 ? line.substring(0, commentIndex) : line;
				processedLine = processedLine.trim();
				
				if (!processedLine.isEmpty()) {
					currentStatement.append(" ").append(processedLine);
					
					// Se encontra ponto-e-vírgula, executa o statement
					if (processedLine.endsWith(";")) {
						String statement = currentStatement.toString().trim();
						if (!statement.isEmpty() && !statement.equals(";")) {
							// Remove o ponto-e-vírgula final
							statement = statement.substring(0, statement.length() - 1).trim();
							jdbcTemplate.execute(statement);
						}
						currentStatement = new StringBuilder();
					}
				}
			}
		} catch (IOException e) {
			throw new BadRequestException("Erro ao executar reboot: " + e.getMessage());
		}
	}

	@Transactional
	public void reassignClienteToGerente(Long clienteId, String novoGerenteCpf) {
		log.info("Reassigning cliente {} to gerente {}", clienteId, novoGerenteCpf);
		
		Cliente cliente = repository.findById(clienteId)
				.orElseThrow(() -> new ResourceNotFoundException("Cliente"));
		
		String antigoGerenteCpf = cliente.getCpf_gerente();
		cliente.setCpf_gerente(novoGerenteCpf);
		repository.save(cliente);
		
		log.info("Cliente {} reassigned from gerente {} to gerente {}", 
				clienteId, antigoGerenteCpf, novoGerenteCpf);
	}

}
