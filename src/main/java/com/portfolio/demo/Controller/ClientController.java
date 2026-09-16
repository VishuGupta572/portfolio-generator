package com.portfolio.demo.Controller;

import com.portfolio.demo.DTO.ClientRequestDTO;
import com.portfolio.demo.Service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
public class ClientController {
    @Autowired
    private ClientService clientService;

    @PostMapping("/ClientTalk")
    public String ClientTalk(@RequestBody ClientRequestDTO requestDTO) {
        return clientService.ClientTalk(requestDTO);
    }

    @PostMapping("/clear")
    public String clearHistory() {
        clientService.clearHistory();
        return "Conversation history cleared successfully";
    }
}