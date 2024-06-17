import {
  Button,
  InputGroup,
  FormGroup,
  HTMLSelect,
  UL,
  Elevation,
  NumericInput,
  SectionCard,
  Section,
  OverlayToaster,
  Toast2,
  Toaster,
  CompoundTag,
  Tag,
} from "@blueprintjs/core";
import { Card, CardList } from "@blueprintjs/core";

import React, { useState, useEffect } from "react";
import axios from "axios";

import "react-toastify/dist/ReactToastify.css";

interface User {
  id: number;
  name: string;
  phone_number: string;
}

interface Device {
  id: number;
  device_id: string;
}
const myToaster: Toaster = await OverlayToaster.createAsync({
  position: "top",
});
const showToast = (
  message: string,
  intent: "none" | "primary" | "success" | "warning" | "danger"
) => {
  myToaster.show({ message, intent });
};

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [userDevices, setUserDevices] = useState<{ [key: number]: Device[] }>(
    {}
  );
  const [userName, setUserName] = useState<string>("");
  const [userPhoneNumber, setUserPhoneNumber] = useState<string>("");
  const [deviceId, setDeviceId] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>("http://localhost:5000/users");
      setUsers(response.data);
    } catch (error) {
      showToast("Failed to fetch users.", "danger");
    }
  };

  const handleRegisterUser = async () => {
    try {
      await axios.post("http://localhost:5000/register_user", {
        name: userName,
        phone_number: userPhoneNumber,
      });
      showToast("User registered successfully.", "success");
      fetchUsers();
    } catch (error) {
      showToast("Failed to register user.", "danger");
      console.log(error);
    }
  };

  const handleRegisterDevice = async () => {
    try {
      await axios.post("http://localhost:5000/register_device", {
        user_id: selectedUserId,
        device_id: deviceId,
      });
      showToast("Device registered successfully.", "success");
    } catch (error) {
      showToast("Failed to register device.", "danger");
    }
  };

  const handleTriggerAlarm = async () => {
    try {
      await axios.post("http://localhost:5000/trigger_alarm", {
        phone_number: userPhoneNumber,
      });
      showToast("Alarm triggered successfully.", "success");
    } catch (error) {
      showToast("Failed to trigger alarm.", "danger");
    }
  };

  const handleDeactivateAlarm = async () => {
    try {
      await axios.post("http://localhost:5000/deactivate_alarm", {
        phone_number: userPhoneNumber,
      });
      showToast("Alarm deactivated successfully.", "success");
    } catch (error) {
      showToast("Failed to deactivate alarm.", "danger");
    }
  };

  const handleFetchUserDevices = async (userId: number) => {
    try {
      const response = await axios.get<Device[]>(
        `http://localhost:5000/user_devices/${userId}`
      );
      setUserDevices((prevState) => ({
        ...prevState,
        [userId]: response.data,
      }));
    } catch (error) {
      showToast("Failed to fetch user devices.", "danger");
    }
  };
  //   # all routes
  // # POST /register_user
  // # POST /register_device
  // # GET /users
  // # GET /user_devices/<int:user_id>
  // # POST /trigger_alarm
  // # POST /deactivate_alarm

  const TestButton = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      console.log(response.data);
      showToast("User registered successfully.", "success");
    } catch (error) {
      showToast("Failed to fetch users.", "danger");
    }
  };

  return (
    <div className="">
      <h1 className=" text-4xl">Alarm Community System</h1>
      <div>
        <Button onClick={TestButton}>Test Button</Button>
      </div>
      <Section
        className="sample-class"
        // collapseProps={/* sample collapseProps */}
        collapsible={false}
        compact={false}
        elevation={Elevation.ZERO}
        icon="user"
        // rightElement={/* sample rightElement */}
        subtitle="This is where the member of the community will be registered "
        title="Register User"
        // titleRenderer={/* sample titleRenderer */}
      >
        <SectionCard>
          <div className=" p-2">
            <h2>Register User</h2>
            <FormGroup
              label="Name"
              helperText="Please enter residents name...."
              labelInfo="(required)"
              labelFor="text-input"
            >
              <InputGroup
                type="text"
                placeholder="Name"
                value={userName}
                onChange={(e: any) => setUserName(e.target.value)}
              />
            </FormGroup>
            <FormGroup label="Phone Number">
              <NumericInput
                placeholder="Phone Number"
                value={userPhoneNumber}
                onChange={(e: any) => setUserPhoneNumber(e.target.value)}
              />
            </FormGroup>
            <Button onClick={handleRegisterUser}>Register User</Button>
          </div>
        </SectionCard>
      </Section>

      <Section
        className="sample-class"
        // collapseProps={/* sample collapseProps */}
        collapsible={false}
        compact={false}
        elevation={Elevation.ONE}
        icon="satellite"
        // rightElement={/* sample rightElement */}
        subtitle="Registration of the house alarm module"
        title="Register Device"
        // titleRenderer={/* sample titleRenderer */}
      >
        <SectionCard>
          <FormGroup label="User">
            <HTMLSelect
              onChange={(e: any) => setSelectedUserId(e.target.value)}
              value={selectedUserId}
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </HTMLSelect>
          </FormGroup>
          <FormGroup label="Device ID">
            <InputGroup
              type="text"
              placeholder="Device ID"
              value={deviceId}
              onChange={(e: any) => setDeviceId(e.target.value)}
            />
          </FormGroup>
          <Button onClick={handleRegisterDevice}>Register Device</Button>
        </SectionCard>
      </Section>
      <Section
        className="sample-class"
        // collapseProps={/* sample collapseProps */}
        collapsible={false}
        compact={false}
        elevation={Elevation.ZERO}
        icon="take-action"
        // rightElement={/* sample rightElement */}
        subtitle="Actions for an individual user "
        title="User Actions"
        // titleRenderer={/* sample titleRenderer */}
      >
        <SectionCard>
          <h2>Trigger Alarm</h2>
          <FormGroup label="Phone Number">
            <InputGroup
              type="text"
              placeholder="Phone Number"
              value={userPhoneNumber}
              onChange={(e: any) => setUserPhoneNumber(e.target.value)}
            />
          </FormGroup>
          <Button onClick={handleTriggerAlarm}>Trigger Alarm</Button>
        </SectionCard>
        <SectionCard>
          <h2>Deactivate Alarm</h2>
          <FormGroup label="Phone Number">
            <InputGroup
              type="text"
              placeholder="Phone Number"
              value={userPhoneNumber}
              onChange={(e: any) => setUserPhoneNumber(e.target.value)}
            />
          </FormGroup>
          <Button onClick={handleDeactivateAlarm}>Deactivate Alarm</Button>
        </SectionCard>
      </Section>

      <div>
        <h2>Users and Their Devices</h2>
        <CardList>
          {users.map((user) => (
            <SectionCard key={user.id}>
              <CompoundTag
                key={user.id}
                leftContent={user.phone_number}
                // onRemove={removable && onRemove}
                icon="user"
                // round={true}
                // rightIcon={rightIcon === true ? "map-marker" : undefined}
                // {...tagProps}
              >
                {user.name}
              </CompoundTag>

              <Button onClick={() => handleFetchUserDevices(user.id)}>
                Fetch Devices
              </Button>
              {userDevices[user.id]?.map((device) => (
                <Tag key={device.id}>{device.device_id}</Tag>
              ))}
            </SectionCard>
          ))}
        </CardList>
      </div>
    </div>
  );
}

export default App;
