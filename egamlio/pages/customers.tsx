import Head from "next/head";
import Link from "next/link";
import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import withAuth from "@/middleware/withAuth"; 

interface Customer {
  id: string;
  first_name: string;
  other_names: string;
  gender: string;
  mobile_number: string;
  email: string;
  description: string;
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "https://stemprotocol.codefremics.com/api/v2/customers/get-merchant-customers/1",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === 200) {
          const customersData = response.data.response;
          if (Array.isArray(customersData)) {
            const parsedCustomers: Customer[] = customersData.map((customer: any) => ({
              id: customer.customer_id,
              first_name: customer.first_name,
              other_names: customer.other_names,
              gender: customer.gender,
              mobile_number: customer.number,
              email: customer.email,
              description: customer.description
            }));
            setCustomers(parsedCustomers);
          } else {
            setError(response.data.description);
          }
        }
      } catch (error) {
        setError("Error fetching customers.");
      }
    };

    fetchCustomers();
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCustomers : Customer[] = Array.isArray(customers) ? customers.filter((customer) => {
    const fullName = `${customer.first_name} ${customer.other_names}`;
    const customerData = `${fullName} ${customer.email} ${customer.mobile_number}`.toLowerCase();
    return customerData.includes(searchTerm.toLowerCase());
  }):[];

  const handleRowClick = (id: string) => {
    router.push(`/customer/${id}`);
  };

  return (
    <>
      <Head>
        <title>Customers - Egamlio</title>
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
                  <img src="/images/logo.png" alt="image" />
                </div>
              </div>
            </div>
            <div className="row pt-120 d-flex justify-content-center">
              <div className="col-lg-10">
                <div className="login-reg-main text-center">
                  <div className="form-area">
                    <div className="section-text">
                      <h4>Customer List</h4>
                    </div>
                    <div className="search-box">
                      <input
                        style={{ color: 'black' }}
                        type="text"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>
                    {error && <div className="error">{error}</div>}
                    <div className="customer-list">
                      <table className="table" style={{color: "whitesmoke"}}>
                        <thead>
                          <tr>
                            <th >First Name</th>
                            <th>Other Names</th>
                            <th>Gender</th>
                            <th>Mobile Number</th>
                            <th style={{display: "flex", justifyContent: "center"}} >Email</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCustomers.length > 0 ? (
                            filteredCustomers.map((customer) => (
                              <tr
                                key={customer.id}
                                onClick={() => handleRowClick(customer.id)}
                                style={{ cursor: "pointer" }}
                              >
                                <td>{customer.first_name}</td>
                                <td>{customer.other_names}</td>
                                <td>{customer.gender}</td>
                                <td>{customer.mobile_number}</td>
                                <td>{customer.email}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5}>No customers found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
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

export default withAuth(Customers);
