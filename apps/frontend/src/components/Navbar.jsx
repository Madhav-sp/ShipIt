import { useEffect, useState } from "react";
import axios from "axios";

function Navbar() {

  const [user, setUser] =
    useState(null);

  useEffect(() => {

    axios
      .get(
        "http://localhost:3000/me",
        {
          withCredentials: true,
        }
      )

      .then((res) => {
        setUser(res.data);
      })

      .catch(() => {
        setUser(null);
      });

  }, []);

  const handleLogout =
    async () => {

      try {

        await axios.get(
          "http://localhost:3000/logout",
          {
            withCredentials: true,
          }
        );

        setUser(null);

        window.location.reload();

      } catch (err) {

        console.error(err);

      }

    };

  return (
    <div className="border-b border-gray-800 px-8 py-4 flex justify-between items-center">

      <h1 className="text-xl font-bold">
        ShipIt
      </h1>

      {user ? (

        <div className="flex items-center gap-4">

          <img
            src={user.avatarUrl}
            alt={user.username}
            className="w-10 h-10 rounded-full"
          />

          <span>
            {user.username}
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded"
          >
            Logout
          </button>

        </div>

      ) : (

        <a
          href="http://localhost:3000/auth/github"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Login With GitHub
        </a>

      )}

    </div>
  );
}

export default Navbar;