package mx.bepos.pos.domain.repositories;

import mx.bepos.pos.domain.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
}
