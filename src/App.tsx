import { useEffect, useState } from 'react'
import {
  TextField,
  Button,
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import './App.css'
// @import "tailwindcss";
import axios from 'axios';

function App() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    wheels: "",
    vehcileType: "",
    model: "",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState("");
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [models, setModels] = useState([]);

  // async function to fetch the 
  async function callVehicleTypesAPI() {
    try {
      const res = await axios.get(`https://rentalappdrizzle-2.onrender.com/vehicle-types?wheels=${formData.wheels}`);
      setVehicleTypes(res.data);
      setFormData({ ...formData, vehcileType: "", model: "" });
      setModels([]);
    }
    catch (err) {
      console.error(err);
    }
  }

  // async function to fetch the models for the selected vehicle type.
  async function fetchModels() {
    try {
      const selectedType = vehicleTypes.find(
        (t) => t.name === formData.vehcileType
      );
      if (!selectedType) return;

      const res = await axios.get(
        `https://rentalappdrizzle-2.onrender.com/vehicles?vehicleTypeId=${selectedType.id}`
      );
      setModels(res.data);
      setFormData({ ...formData, model: "" });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!formData.vehcileType) return;
    fetchModels();

  }, [formData.vehcileType]);

  useEffect(() => {
    if (!formData.wheels) return;
    callVehicleTypesAPI();

  }, [formData.wheels]);


  // function to handle the logic for the form. (Stepwise flow of the form).
  const handleNext = () => {
    if (step === 0 && (!formData.firstName || !formData.lastName)) {
      setError("Please enter both first & last name");
      return;
    }

    if (step === 1 && (!formData.wheels)) {
      setError("Please select number of wheels!");
      return;
    }

    if (step === 2 && (!formData.vehcileType)) {
      setError("Please select vehicle type!");
      return;
    }

    setError("");
    setStep(step + 1); // Doing this to increment the form, provided if all the data is filled in consecutive steps.
  }

  // Logic just to handle the back navigation scenario of the form. Decrease the form step by 1.
  const handlePrev = () => {
    setError("");
    setStep(step - 1);
  };


  const handleSubmit = async () => {
    try {
      const res = await axios.post("https://rentalappdrizzle-2.onrender.com/bookings", {
        userId: 1,
        vehicleId: models.find((m) => m.name === formData.model).id,
        startDate: formData.startDate,
        endDate: formData.endDate,
      });
      alert("Booking successful!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Booking failed");
    }
  };


  // The main JSX that is being rendered on the screen (the UI).
  return (
    <div style={styles.formBox}>

      {/* Step 0: Name */}
      {step === 0 && (
        <>
          <h2>Enter your name</h2>
          <input
            style={styles.input}
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
        </>
      )}

      {/* Step 1: Wheels */}
      {step === 1 && (
        <>
          <h2>Number of wheels</h2>
          <label>
            <input
              type="radio"
              name="wheels"
              value="2"
              checked={formData.wheels === "2"}
              onChange={(e) =>
                setFormData({ ...formData, wheels: e.target.value })
              }
            />
            2
          </label>
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              name="wheels"
              value="4"
              checked={formData.wheels === "4"}
              onChange={(e) =>
                setFormData({ ...formData, wheels: e.target.value })
              }
            />
            4
          </label>
        </>
      )}

      {/* Step 2: Vehicle Type */}
      {step === 2 && (
        <>
          <h2>Select Vehicle Type</h2>
          {vehicleTypes.length === 0 ? (
            <p>Loading...</p>
          ) : (
            vehicleTypes.map((t) => (
              <label key={t.id}>
                <input
                  type="radio"
                  name="vehicleType"
                  value={t.name}
                  checked={formData.vehcileType === t.name}
                  onChange={(e) =>
                    setFormData({ ...formData, vehcileType: e.target.value })
                  }
                />
                {t.name}
              </label>
            ))
          )}
        </>
      )}

      {/* Step 3: Vehicle Model */}
      {step === 3 && (
        <>
          <h2>Select Vehicle Model</h2>
          {models.length === 0 ? (
            <p>Loading...</p>
          ) : (
            models.map((m) => (
              <label key={m.id}>
                <input
                  type="radio"
                  name="model"
                  value={m.name}
                  checked={formData.model === m.name}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                />
                {m.name}
              </label>
            ))
          )}
        </>
      )}

      {/* Step 4: Date Range */}
      {step === 4 && (
        <>
          <h2>Select Date Range</h2>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            style={styles.input}
          />
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            style={styles.input}
          />
        </>
      )}

      {/* Error message */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Navigation Buttons */}
      <div style={{ marginTop: "20px" }}>
        {step > 0 && (
          <button onClick={handlePrev} style={styles.navButton}>
            Previous
          </button>
        )}
        {step < 4 && (
          <button onClick={handleNext} style={styles.navButton}>
            Next
          </button>
        )}
        {step === 4 && (
          <button onClick={handleSubmit} style={styles.navButton}>
            Submit Booking
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "lightblue"
  },
  formBox: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    width: "400px",
    textAlign: "center",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "lightblue",
  },
  navButton: {
    padding: "10px 20px",
    margin: "5px",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
};

export default App
