import { FaGithub } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export function Navbar(): React.ReactNode {
  return (
    <div className="navbar bg-primary">
      <div className="flex-none">
        {/* <button className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-5 h-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button> */}
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">Templix</a>
        <p className="text-sm">by Hunterbidenafterlife</p>
      </div>
      <div className="flex-none">
        <button className="btn btn-ghost">
          <FaGithub size={25} />
        </button>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost rounded-btn">
            Opts
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-60 mt-4"
          >
            <li>
              <a>Change Template Directory</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
