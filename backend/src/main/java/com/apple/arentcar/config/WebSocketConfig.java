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
        registry.addHandler(visitorWebSocketHandler, "/ws/visitor")
                .setAllowedOrigins("http://localhost:3000", "https://43.200.185.148");
    }
}
