"use client";

import React from "react";
import { TeamMember } from "@/shared/types/TeamMember";

interface TeamMemberModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
}

const TeamMemberModal: React.FC<TeamMemberModalProps> = ({
  member,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !member) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-panel">
        <div className="panel-left">
          {member.facebookUrl && (
            <ul className="social-icons">
              <li className="facebook">
                <a
                  href={member.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="36" height="36" viewBox="0 0 24 24">
                    <path
                      fill="#2573a6"
                      d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          )}
        </div>

        <div className="panel-right">
          <div className="panel-header">
            <div className="panel-title">{member.name}</div>
            <button className="close-button" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                />
              </svg>
            </button>
          </div>

          <div className="panel-info">{member.fullName}</div>

          <div className="panel-inner">
            {member.description && (
              <>
                <h2>O mnie</h2>
                <div className="description">
                  {member.description.split("\n\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </>
            )}

            {(member.phone || member.email) && (
              <div className="contact-person">
                {member.phone && (
                  <div className="contact-item">
                    <svg
                      style={{
                        width: "36px",
                        height: "36px",
                        marginRight: "0.5rem",
                      }}
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#2573a6"
                        d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"
                      />
                    </svg>
                    <a href={`tel:+48${member.phone}`}>{member.phone}</a>
                  </div>
                )}

                {member.email && (
                  <div className="contact-item">
                    <svg
                      style={{
                        width: "36px",
                        height: "36px",
                        marginRight: "0.5rem",
                      }}
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#2573a6"
                        d="M20 8l-8 5-8-5V6l8 5 8-5m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"
                      />
                    </svg>
                    <a href={`mailto:${member.email}`}>{member.email}</a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 999;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal-panel {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          z-index: 1000;
          max-width: 800px;
          width: 90%;
          max-height: 85vh;
          overflow-y: auto;
          display: flex;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -45%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        .panel-left {
          background: #f5f5f5;
          padding: 30px 20px;
          min-width: 80px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .social-icons {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .social-icons li {
          margin-bottom: 15px;
        }

        .social-icons a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 50%;
          transition: transform 0.2s ease;
        }

        .social-icons a:hover {
          transform: scale(1.1);
        }

        .panel-right {
          flex: 1;
          padding: 30px;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 2px solid #2573a6;
        }

        .panel-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #2573a6;
        }

        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
          color: #666;
          transition: color 0.2s ease;
        }

        .close-button:hover {
          color: #2573a6;
        }

        .panel-info {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 25px;
          font-weight: 500;
        }

        .panel-inner h2 {
          color: #2573a6;
          font-size: 1.4rem;
          margin-bottom: 15px;
          margin-top: 25px;
        }

        .description p {
          line-height: 1.6;
          color: #333;
          margin-bottom: 15px;
        }

        .contact-person {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .contact-item {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }

        .contact-item a {
          color: #2573a6;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .contact-item a:hover {
          color: #1a5680;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .modal-panel {
            flex-direction: column;
            width: 95%;
            max-height: 90vh;
          }

          .panel-left {
            flex-direction: row;
            padding: 15px;
            min-width: unset;
          }

          .social-icons {
            display: flex;
          }

          .social-icons li {
            margin-right: 15px;
            margin-bottom: 0;
          }

          .panel-right {
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
};

export default TeamMemberModal;
