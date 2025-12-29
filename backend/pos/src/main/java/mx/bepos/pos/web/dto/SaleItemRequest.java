package mx.bepos.pos.web.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SaleItemRequest {
    private Integer productId;
    private BigDecimal quantity;
}
