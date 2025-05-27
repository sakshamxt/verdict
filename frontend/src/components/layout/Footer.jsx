
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-secondary border-t border-border-color py-8 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm text-text-secondary">
          &copy; {currentYear} Verdict. All rights reserved.
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Developed by Saksham Tyagi
        </p>
        {/* You can add more links or information here */}
      </div>
    </footer>
  );
};

export default Footer;