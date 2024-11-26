import { useState } from "react";
import './RentalRates.css'
import ManagePayment from "./ManagePayment";

const RentalRates = () => {

  const [activeComponent, setActiveComponent] = useState("RantalRatesMain");

  const navigateManagePayment = () => {
    setActiveComponent("ManagePayment");
  };

  const navigateManageRefund = () => {
    setActiveComponent("ManageRefund");
  };

  const navigateBackToRentalRatesMain = () => {
    setActiveComponent("RantalRatesMain");
  };

    return (
        <div className="rental-rates-main-wrap">
          <ManagePayment/>
        </div>
    );
};

export default RentalRates;