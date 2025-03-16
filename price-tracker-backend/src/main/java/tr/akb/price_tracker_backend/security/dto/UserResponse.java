package tr.akb.price_tracker_backend.security.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class UserResponse {
    private String username;
    private String email;
}
