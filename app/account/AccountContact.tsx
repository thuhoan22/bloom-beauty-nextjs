"use client"

export default function AccountContact() {
  return (
    <>
      <h3 className="text-title">Contact information</h3>
      <div className="info-main">
        <ul className="info-list">
          <li className="info-item">
            <label htmlFor="mail" className="label">Mail</label>
            <input type="text" id="mail" className="input" placeholder="Email" />
          </li>
          <li className="info-item info-item-col">
            <div className="col">
              <label htmlFor="name" className="label">Name</label>
              <input type="text" id="name" className="input" placeholder="Name" />
            </div>
            <div className="col">
              <label htmlFor="last-name" className="label">Last name</label>
              <input type="text" id="last-name" className="input" placeholder="Last name" />
            </div>
          </li>
        </ul>
        <button type="button" className="btn btn-secondary btn-save">Save</button>
      </div>
    </>
  )
}
