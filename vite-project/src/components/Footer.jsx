function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h3 className="text-2xl font-bold mb-4">🛍️ Kathir's shop</h3>
        <p className="m-0 text-purple-200"></p>
        <div className="mt-4 flex justify-center gap-6">
          <span className="text-purple-200 hover:text-yellow-300 cursor-pointer">Privacy Policy</span>
          <span className="text-purple-200 hover:text-yellow-300 cursor-pointer">Terms of Service</span>
          <span className="text-purple-200 hover:text-yellow-300 cursor-pointer">Contact Us</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
