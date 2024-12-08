package com.apple.arentcar.config;

import com.apple.arentcar.util.VisitorWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final VisitorWebSocketHandler visitorWebSocketHandler;

    public WebSocketConfig(VisitorWebSocketHandler visitorWebSocketHandler) {
        this.visitorWebSocketHandler = visitorWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
            registry.addHandler(visitorWebSocketHandler, "/ws/")
                .setAllowedOrigins("http://43.203.201.45", "http://localhost:3000");
    }
}

