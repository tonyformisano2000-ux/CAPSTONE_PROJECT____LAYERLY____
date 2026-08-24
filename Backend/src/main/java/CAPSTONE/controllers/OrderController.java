package CAPSTONE.controllers;

import CAPSTONE.dto.OrderResponseDTO;
import CAPSTONE.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping("/customer/{customerId}")
    public List<OrderResponseDTO> getOrdersByCustomer(@PathVariable Long customerId) {
        return orderService.getOrdersByCustomerId(customerId);
    }

    @PostMapping
    public OrderResponseDTO createOrder(@RequestBody CreateOrderRequest request) {
        return orderService.createOrder(request.getCustomerId(), request.getDesignIds());
    }

    public static class CreateOrderRequest {
        private Long customerId;
        private List<Long> designIds;

        public Long getCustomerId() { return customerId; }
        public void setCustomerId(Long customerId) { this.customerId = customerId; }
        public List<Long> getDesignIds() { return designIds; }
        public void setDesignIds(List<Long> designIds) { this.designIds = designIds; }
    }
}