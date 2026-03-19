package csd230.bookstore.controllers;

import csd230.bookstore.entities.TicketEntity;
import csd230.bookstore.repositories.TicketEntityRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Ticket REST API", description = "JSON API for managing tickets")
@RestController
@RequestMapping("/api/rest/tickets")
@CrossOrigin(origins = "*")
public class TicketRestController {

    private final TicketEntityRepository ticketRepository;

    public TicketRestController(TicketEntityRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @GetMapping
    public List<TicketEntity> all() {
        return ticketRepository.findAll();
    }

    @GetMapping("/{id}")
    public TicketEntity getTicket(@PathVariable Long id) {
        return ticketRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public TicketEntity newTicket(@RequestBody TicketEntity newTicket) {
        return ticketRepository.save(newTicket);
    }

    @PutMapping("/{id}")
    public TicketEntity updateTicket(@RequestBody TicketEntity newTicket, @PathVariable Long id) {
        return ticketRepository.findById(id)
                .map(ticket -> {
                    ticket.setDescription(newTicket.getDescription());
                    ticket.setPrice(newTicket.getPrice());
                    return ticketRepository.save(ticket);
                })
                .orElseGet(() -> {
                    newTicket.setId(id);
                    return ticketRepository.save(newTicket);
                });
    }

    @DeleteMapping("/{id}")
    public void deleteTicket(@PathVariable Long id) {
        ticketRepository.deleteById(id);
    }
}