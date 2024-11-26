    package com.apple.arentcar.model;

    import lombok.Getter;
    import lombok.NoArgsConstructor;
    import lombok.Setter;

    @Getter
    @Setter
    @NoArgsConstructor
    public class Reservations {
        private Integer reservationCode;
        private Integer userCode;
        private String userName;
        private Integer carCode;
        private String carName;
        private Integer rentalLocation;
        private String rentalLocationName;
        private Integer returnLocation;
        private String returnLocationName;
        private String rentalDate;
        private String rentalTime;
        private String returnDate;
        private String returnTime;
        private String insuranceType;
        private String paymentCategory;
        private String paymentType;
        private Integer paymentAmount;
    }
