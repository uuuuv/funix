const BannerError = ({ msg }) => (
  <div className="d-flex align-items-center justify-content-center bg-secondary h-100">
    <div>
      <p className="text-center text-light">Error: {msg}</p>
    </div>
  </div>
);

export default BannerError;
