// pages/create-customer.tsx

import Head from "next/head";
import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import withAuth from "@/middleware/withAuth";

const CreateCustomer = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    other_names: "",
    gender: "",
    number: "",
    email: "",
    description: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement| HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "https://stemprotocol.codefremics.com/api/v2/customers/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data); // Log the response data

      if (response.data.status === 200) {
        router.push("/customers");
      } else {
        setErrorMessage(response.data.description);
      }
    } catch (error) {
      setErrorMessage("An error occurred while creating the customer");
      console.error("Create customer error:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Create Customer - Egamlio</title>
      </Head>
      <section className="login-reg">
        <div className="overlay pb-120">
          <div className="container">
            <div className="top-area pt-4 mb-30">
              <div className="row d-flex align-items-center">
                <div className="col-sm-5 col">
                  <Link className="back-home" href="/home">
                    <img src="/images/icon/left-icon.png" alt="image" />
                    Back to Home
                  </Link>
                </div>
                <div className="col-sm-2 text-center col">
                  <Link href="/index-3">
                    <img src="/images/logo.png" alt="image" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="row pt-120 d-flex justify-content-center">
              <div className="col-lg-6">
                <div className="login-reg-main text-center">
                  <div className="form-area">
                    <div className="section-text">
                      <h4>Create New Customer</h4>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-12">
                          {[
                            "first_name",
                            "other_names",
                            "mobile_number",
                            "email",
                            "description",
                          ].map((field) => (
                            <div className="single-input" key={field}>
                              <label htmlFor={field}>
                                {field.replace("_", " ")}
                              </label>
                              <div className="input-box">
                                <input
                                  type={field === "email" ? "email" : "text"}
                                  id={field}
                                  name={field}
                                  placeholder={`Enter ${field.replace("_", " ")}`}
                                  value={formData[field as keyof typeof formData]}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>
                          ))}
                          <div className="single-input">
                            <label htmlFor="gender">Gender</label>
                            <div className="input-box">
                              <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                              >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      {errorMessage && <div style={{ backgroundColor: "white", color: "red"}} >{errorMessage}</div>}
                      <button className="cmn-btn mt-40 w-100">
                        Create Customer
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default withAuth(CreateCustomer);