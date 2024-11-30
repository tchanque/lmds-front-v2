import { useState } from "react";
import './Register.css';
import { axiosPrivate } from "../../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("Etudiant");
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState("2999-12-31");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();

    axiosPrivate
    .post("/users", { user: { email: email, password: password, first_name: firstName, last_name: lastName, role: role, subscription_end_date: subscriptionEndDate, is_subscriber: isSubscriber } })
    .then((response) => {
      navigate("/login");
    })
    .catch((error) => {
      if (error.response) {
        // console.log(error.response);
      } else {
        console.error(error);
      }
    });
  };

  return (
    <section className="dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-center font-Ubuntu text-primary-dark md:text-2xl dark:text-white">
              CRÉATION DE COMPTE
            </h1>
            
            <form action="#" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-center font-hind-vadodara text-grey-main dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 border border-primary-main text-grey-main text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Nom@test.com"
                    required
                  />
                </div>
                <div className="flex-grow tooltip">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-center font-hind-vadodara text-grey-main dark:text-white"
                  >
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-50 border border-primary-main text-grey-main text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Mot de passe"
                    required
                  />
                  <span className="tooltiptext">Votre mot de passe doit contenir au minimum : <br /> - 8 caractères <br /> - 1 chiffre <br /> - 1 lettre minuscule <br /> - 1 lettre majuscule <br /> - 1 caractère spécial </span>
                </div>
                <div>
                  <label
                    htmlFor="first_name"
                    className="block mb-2 text-sm font-medium text-center font-hind-vadodara text-grey-main dark:text-white"
                  >
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-gray-50 border border-primary-main text-grey-main text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Prénom"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-center font-hind-vadodara text-grey-main dark:text-white"
                  >
                    Nom
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-gray-50 border border-primary-main text-grey-main text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Nom"
                    required
                  />
                </div>
                </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-24 mt-10 text-white bg-primary-main hover:bg-primary-dark font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Créer
                </button>
              </div>
            </form>         
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register
