package mx.bepos.pos.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mx.bepos.pos.domain.Supplier;
import mx.bepos.pos.domain.repositories.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SupplierService {

    private final SupplierRepository supplierRepository;

    @Transactional(readOnly = true)
    public List<Supplier> getAllSuppliers() {
        log.info("Fetching all suppliers");
        return supplierRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Supplier> getSupplierById(Integer id) {
        log.info("Fetching supplier by id: {}", id);
        return supplierRepository.findById(id);
    }

    @Transactional
    public Supplier saveSupplier(Supplier supplier) {
        log.info("Saving supplier: {}", supplier);
        return supplierRepository.save(supplier);
    }

    @Transactional
    public void deleteSupplier(Integer id) {
        log.info("Deleting supplier by id: {}", id);
        supplierRepository.deleteById(id);
    }
}
