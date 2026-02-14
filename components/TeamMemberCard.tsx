"use client";

import React from "react";
import Image from "next/image";
import { TeamMember } from "@/shared/types/TeamMember";

interface TeamMemberCardProps {
  member: TeamMember;
  onClick: () => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, onClick }) => {
  // Sekstet ma większe zdjęcia
  const isSekstet = member.section === "Sekstet";
  const imageHeight = isSekstet ? 400 : 300;

  return (
    <li
      className={`team-member-card ${isSekstet ? "sekstet" : ""}`}
      onClick={onClick}
    >
      <figure>
        <div className="image-container">
          <Image
            src={member.imageUrl}
            alt={member.name}
            width={600}
            height={600}
            className="member-image"
            priority={isSekstet}
          />
          <div className="member-zoom"></div>
        </div>
        <figcaption>
          {member.section && (
            <div className="section-badge">{member.section}</div>
          )}
          <div className="member-desc">
            <div>
              <span className="member-name">{member.name}</span>
            </div>
            <div>
              <span className="member-info">{member.fullName}</span>
            </div>
            {member.belongsTo && (
              <div className="belongs-to">
                <span className="przeslo-badge">📍 {member.belongsTo}</span>
              </div>
            )}
          </div>
        </figcaption>
      </figure>

      <style jsx>{`
        .team-member-card {
          list-style: none;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .team-member-card.sekstet {
          grid-column: span 2;
        }

        @media (max-width: 900px) {
          .team-member-card.sekstet {
            grid-column: span 1;
          }
        }

        .team-member-card:hover {
          transform: translateY(-5px);
        }

        figure {
          position: relative;
          margin: 0;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          background: white;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .image-container {
          position: relative;
          width: 100%;
          height: ${imageHeight}px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .member-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .team-member-card:hover .member-image {
          transform: scale(1.05);
        }

        .member-zoom {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(37, 115, 166, 0.2);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .team-member-card:hover .member-zoom {
          opacity: 1;
        }

        figcaption {
          padding: 20px;
          background: white;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .section-badge {
          display: inline-block;
          padding: 4px 12px;
          background: #2573a6;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 12px;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .member-desc {
          text-align: center;
        }

        .member-name {
          display: block;
          font-size: 1.2rem;
          font-weight: 600;
          color: #2573a6;
          margin-bottom: 8px;
        }

        .member-info {
          display: block;
          font-size: 0.95rem;
          color: #666;
          margin-bottom: 8px;
        }

        .belongs-to {
          margin-top: 10px;
        }

        .przeslo-badge {
          display: inline-block;
          padding: 4px 12px;
          background: #e3f2fd;
          color: #1976d2;
          font-size: 0.8rem;
          border-radius: 12px;
          border: 1px solid #bbdefb;
          font-weight: 500;
        }
      `}</style>
    </li>
  );
};

export default TeamMemberCard;
