package csd230.bookstore.controllers;

import csd230.bookstore.entities.MagazineEntity;
import csd230.bookstore.repositories.MagazineEntityRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Tag(name = "Magazine REST API", description = "JSON API for managing magazines")
@RestController
@RequestMapping("/api/rest/magazines")
@CrossOrigin(origins = "*")
public class MagazineRestController {

    private final MagazineEntityRepository magazineRepository;

    public MagazineRestController(MagazineEntityRepository magazineRepository) {
        this.magazineRepository = magazineRepository;
    }

    @GetMapping
    public List<MagazineEntity> all() {
        return magazineRepository.findAll();
    }

    @GetMapping("/{id}")
    public MagazineEntity getMagazine(@PathVariable Long id) {
        return magazineRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public MagazineEntity newMagazine(@RequestBody MagazineEntity newMagazine) {
        return magazineRepository.save(newMagazine);
    }

    @PutMapping("/{id}")
    public MagazineEntity replaceMagazine(@RequestBody MagazineEntity newMag, @PathVariable Long id) {
        return magazineRepository.findById(id)
                .map(mag -> {
                    mag.setTitle(newMag.getTitle());
                    mag.setPrice(newMag.getPrice());
                    mag.setCopies(newMag.getCopies());
                    mag.setOrderQty(newMag.getOrderQty());
                    mag.setCurrentIssue(newMag.getCurrentIssue());
                    return magazineRepository.save(mag);
                })
                .orElseGet(() -> {
                    newMag.setId(id);
                    return magazineRepository.save(newMag);
                });
    }

    @DeleteMapping("/{id}")
    public void deleteMagazine(@PathVariable Long id) {
        magazineRepository.deleteById(id);
    }
}

