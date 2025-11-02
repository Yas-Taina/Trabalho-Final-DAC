package dac.ufpr.Auth.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tokenRevogado")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TokenRevogado {

    private String id;
    private String token;
    private java.time.Instant dataExpiracao;
    private java.time.Instant dataRevogacao;
}
