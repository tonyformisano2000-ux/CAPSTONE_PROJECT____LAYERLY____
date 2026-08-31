package CAPSTONE.services;

import CAPSTONE.dto.OrderResponseDTO;
import CAPSTONE.entities.*;
import CAPSTONE.enums.OrderStatus;
import CAPSTONE.exceptions.ResourceNotFoundException;
import CAPSTONE.repositories.DesignRepository;
import CAPSTONE.repositories.OrderItemRepository;
import CAPSTONE.repositories.OrderRepository;
import CAPSTONE.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private DesignRepository designRepository;

    @Autowired
    private UserRepository userRepository;

    public List<OrderResponseDTO> getOrdersByCustomerId(Long customerId) {
        return orderRepository.findByCustomerId(customerId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public OrderResponseDTO createOrder(List<Long> designIds) {
        User customer = getCurrentAuthenticatedUser();

        List<Design> designs = designIds.stream()
                .map(id -> designRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Design not found with id: " + id)))
                .toList();

        double total = designs.stream()
                .mapToDouble(Design::getPrice)
                .sum();

        Order order = new Order();
        order.setCustomer(customer);
        order.setStatus(OrderStatus.PAID); // pagamento simulato, come deciso — non PENDING
        order.setTotal(total);
        order.setCreatedAt(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);

        for (Design design : designs) {
            OrderItem item = new OrderItem();
            item.setOrder(savedOrder);
            item.setDesign(design);
            item.setPriceAtPurchase(design.getPrice());
            orderItemRepository.save(item);
        }

        return toResponse(savedOrder);
    }

    private User getCurrentAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    private OrderResponseDTO toResponse(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setCustomerId(order.getCustomer().getId());
        dto.setStatus(order.getStatus().name());
        dto.setTotal(order.getTotal());
        dto.setCreatedAt(order.getCreatedAt());
        return dto;
    }
}