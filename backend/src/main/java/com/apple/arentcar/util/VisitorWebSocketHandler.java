package com.apple.arentcar.util;

import com.apple.arentcar.mapper.VisitorLogMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Component
public class VisitorWebSocketHandler extends TextWebSocketHandler {

    // 현재 접속 중인 사용자 목록 (세션 ID와 WebSocketSession 매핑)
    private final Map<String, WebSocketSession> activeSessions = new ConcurrentHashMap<>();

    @Autowired
    private VisitorLogMapper visitorLogMapper;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
//        System.out.println("WebSocket 연결 성공: " + session.getId());
        String ip = getIpAddress(session); // IP 주소 추출
        activeSessions.put(session.getId(), session);

        // 접속 정보 저장
        saveVisitorLog(ip);

        // 실시간 접속자 정보 전송
        broadcastVisitorInfo("CONNECTED");
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        activeSessions.remove(session.getId());

        // 실시간 접속자 정보 전송
        broadcastVisitorInfo("DISCONNECTED");
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // 클라이언트로부터 메시지를 수신했을 때 처리
        // 현재 구현은 선택 사항 (예: Echo 기능 추가 가능)
    }

    private void broadcastVisitorInfo(String action) {
        try {
            // 접속자 정보 생성
            Map<String, Object> visitorInfo = Map.of(
                    "action", action,
                    "count", activeSessions.size(),
                    "ips", getAllIps()
            );

            // JSON으로 변환
            String json = new ObjectMapper().writeValueAsString(visitorInfo);

            // 모든 클라이언트로 브로드캐스트
            for (WebSocketSession session : activeSessions.values()) {
                if (session.isOpen()) {
                    session.sendMessage(new TextMessage(json));
                }
            }
        } catch (Exception e) {
            System.err.println("Error broadcasting visitor info: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void saveVisitorLog(String ipAddress) {
//        System.out.println("ipAddress : " + ipAddress);

        // 데이터베이스에 접속 기록 저장
        if (visitorLogMapper != null) {
            visitorLogMapper.createVisitorLog(ipAddress);
        } else {
            System.err.println("VisitorLogMapper is not available");
        }
    }

    private String getIpAddress(WebSocketSession session) {
        if (session.getRemoteAddress() == null) {
            return "UNKNOWN";
        }

        String ipAddress = session.getRemoteAddress().getAddress().getHostAddress();

        // IPv6 로컬 주소를 IPv4로 변환
        if ("0:0:0:0:0:0:0:1".equals(ipAddress) || "::1".equals(ipAddress)) {
            return "127.0.0.1";
        }

        // IPv6-mapped IPv4 주소를 변환 (예: ::ffff:192.168.0.1 -> 192.168.0.1)
        if (ipAddress.startsWith("::ffff:")) {
            return ipAddress.substring(7);
        }

        return ipAddress; // IPv4 주소 그대로 반환
    }

    private Iterable<String> getAllIps() {
        return activeSessions.values().stream()
                .map(this::getIpAddress)
                .distinct()
                .collect(Collectors.toList());
    }
}
