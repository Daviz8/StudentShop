import * as React from 'react';

export const EmailTemplate = ({ firstName = 'Admin' }) => {
  return (
    <div
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        backgroundColor: '#f4f4f5',
        padding: '40px 20px',
        margin: '0',
      }}
    >
      <div
        style={{
          maxWidth: '560px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '32px',
          border: '1px solid #e4e4e7',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '24px', borderBottom: '1px solid #f4f4f5', pb: '16px' }}>
          <h2
            style={{
              margin: '0',
              fontSize: '20px',
              fontWeight: '600',
              color: '#09090b',
            }}
          >
            New Sell Request
          </h2>
        </div>

        {/* Content */}
        <p style={{ fontSize: '15px', lineHeight: '24px', color: '#3f3f46', margin: '0 0 16px' }}>
          Hello {firstName},
        </p>

        <p style={{ fontSize: '15px', lineHeight: '24px', color: '#3f3f46', margin: '0 0 24px' }}>
          A user has submitted a new sell request on your platform. Please log in to your admin dashboard to view the details and take action.
        </p>

        {/* Call to Action Button */}
        <div style={{ textAlign: 'left', margin: '32px 0' }}>
          <a
            href="https://studentshopng.com/admin"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#000000',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Go to Admin Dashboard
          </a>
        </div>

        {/* Footer */}
        <hr style={{ borderColor: '#f4f4f5', margin: '32px 0 16px' }} />
        <p style={{ fontSize: '12px', color: '#a1a1aa', margin: '0' }}>
          This is an automated notification from your application.
        </p>
      </div>
    </div>
  );
};