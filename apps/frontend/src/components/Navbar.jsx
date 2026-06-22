function Navbar() {
  return (
    <div className="border-b border-gray-800 px-8 py-4">
      <h1 className="text-xl font-bold">
        ShipIt
      </h1>
      <a
  href="http://localhost:3000/auth/github"
  className="bg-black text-white px-4 py-2 rounded"
>
  Login With GitHub
</a>
    </div>
  );
}

export default Navbar;