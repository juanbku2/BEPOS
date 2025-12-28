package mx.bepos.pos.web.dto;

import lombok.Data;

import java.util.List;

@Data
public class SaleRequest {
    private String paymentMethod;
    private Integer customerId;
    private List<SaleItemRequest> items;
}
