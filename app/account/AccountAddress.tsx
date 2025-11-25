"use client"

export default function AccountAddress() {
  return (
    <>
      <h3 className="text-title">Shipping adress </h3>
      <div className="info-main">
        <ul className="info-list">
          <li className="info-item info-item-col">
            <div className="col">
              <label htmlFor="first-name" className="label">First name</label>
              <input type="text" id="first-name" className="input" placeholder="First name" />
            </div>
            <div className="col">
              <label htmlFor="last-name" className="label">Last name</label>
              <input type="text" id="last-name" className="input" placeholder="Last name" />
            </div>
          </li>
          <li className="info-item">
            <label htmlFor="country" className="label">Country</label>
            <input type="text" id="country" className="input" placeholder="Country" />
          </li>
          <li className="info-item">
            <label htmlFor="adress" className="label">Adress</label>
            <input type="text" id="adress" className="input" placeholder="Adress" />
          </li>
          <li className="info-item info-item-col">
            <div className="col">
              <label htmlFor="city" className="label">City</label>
              <input type="text" id="city" className="input" placeholder="City" />
            </div>
            <div className="col">
              <label htmlFor="postal-code" className="label">Postal code</label>
              <input type="text" id="postal-code" className="input" placeholder="Postal code" />
            </div>
          </li>
        </ul>
        <button type="button" className="btn btn-secondary btn-save">Save</button>
      </div>
    </>
  )
}
