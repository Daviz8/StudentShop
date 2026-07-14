
const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#FFC107]/20 py-12 px-4 sm:px-6 lg:px-8 font-sans text-black">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-10 shadow-sm rounded-lg">
        <h1 className="text-3xl font-extrabold text-[#FFA500] mb-2 uppercase tracking-wide">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8 font-medium">Last updated July 14, 2026</p>

        {/* Introduction */}
        <section className="mb-10 text-gray-800 leading-relaxed space-y-4">
          <p>
            This Privacy Notice for <strong>Student Shop Nigeria Limited</strong> (&apos;we&apos;, &apos;us&apos;, or &apos;our&apos;), describes how and why we might access, collect, store, use, and/or share (&apos;process&apos;) your personal information when you use our services (&apos;Services&apos;), including when you:
          </p>
          <ul className="list-disc pl-6 space-y-3 marker:text-[#FFA500]">
            <li>
              Visit our website at{' '}
              <a href="https://www.studentshopng.com" target="_blank" rel="noopener noreferrer" className="text-[#FFA500] hover:underline font-semibold">
                https://www.studentshopng.com
              </a>{' '}
              or any website of ours that links to this Privacy Notice.
            </li>
            <li>
              Use <strong>Student Shop Nigeria Limited</strong>. Student Shop Nigeria started by observing a real problem. Every academic cycle, students graduating and relocating have useful items they need to clear quickly. At the same time, incoming students need those same items but cannot always afford to buy everything new. We bridge that gap by helping people buy, sell, swap, repair, and access quality essentials at fair prices. Our mission is simple: help you get what you need with the little you have.
            </li>
            <li>
              Engage with us in other related ways, including any marketing or events.
            </li>
          </ul>
          <div className="bg-amber-50 border-l-4 border-[#FFA500] p-4 rounded-r-md mt-4">
            <p className="font-semibold text-gray-900 mb-1">Questions or concerns?</p>
            <p className="text-sm text-gray-700">
              Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at{' '}
              <a href="mailto:studentshopng.info@gmail.com" className="text-[#FFA500] hover:underline font-semibold">
                studentshopng.info@gmail.com
              </a>.
            </p>
          </div>
        </section>

        <hr className="border-gray-200 my-8" />

        {/* Summary of Key Points */}
        <section className="mb-10 text-gray-800 space-y-4">
          <h2 className="text-xl font-bold text-[#FFA500] uppercase tracking-wide">Summary of Key Points</h2>
          <p className="text-sm italic text-gray-500 mb-4">
            This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by using our table of contents below to find the section you are looking for.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <p className="font-semibold text-gray-900">What personal information do we process?</p>
              <p className="text-gray-600">When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-gray-900">Do we process any sensitive personal information?</p>
              <p className="text-gray-600">Some of the information may be considered &apos;special&apos; or &apos;sensitive&apos; in certain jurisdictions. We do not process sensitive personal information.</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-gray-900">Do we collect any information from third parties?</p>
              <p className="text-gray-600">We do not collect any information from third parties.</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-gray-900">How do we process your information?</p>
              <p className="text-gray-600">We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-gray-900">In what situations and with which types of parties do we share personal information?</p>
              <p className="text-gray-600">We may share information in specific situations and with specific categories of third parties.</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-gray-900">How do we keep your information safe?</p>
              <p className="text-gray-600">We have adequate organisational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet can be guaranteed to be 100% secure.</p>
            </div>
          </div>
        </section>

        <hr className="border-gray-200 my-8" />

        {/* Table of Contents */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#FFA500] mb-4 uppercase tracking-wide">Table of Contents</h2>
          <ol className="space-y-2 text-sm font-semibold text-gray-700 list-decimal pl-5">
            <li><a href="#collect" className="text-blue-600 hover:text-blue-800 hover:underline">What information do we collect?</a></li>
            <li><a href="#process" className="text-blue-600 hover:text-blue-800 hover:underline">How do we process your information?</a></li>
            <li><a href="#share" className="text-blue-600 hover:text-blue-800 hover:underline">When and with whom do we share your personal information?</a></li>
            <li><a href="#cookies" className="text-blue-600 hover:text-blue-800 hover:underline">Do we use cookies and other tracking technologies?</a></li>
            <li><a href="#social" className="text-blue-600 hover:text-blue-800 hover:underline">How do we handle your social logins?</a></li>
            <li><a href="#duration" className="text-blue-600 hover:text-blue-800 hover:underline">How long do we keep your information?</a></li>
            <li><a href="#security" className="text-blue-600 hover:text-blue-800 hover:underline">How do we keep your information safe?</a></li>
            <li><a href="#rights" className="text-blue-600 hover:text-blue-800 hover:underline">What are your privacy rights?</a></li>
            <li><a href="#dnt" className="text-blue-600 hover:text-blue-800 hover:underline">Controls for do-not-track features</a></li>
            <li><a href="#updates" className="text-blue-600 hover:text-blue-800 hover:underline">Do we make updates to this notice?</a></li>
            <li><a href="#contact" className="text-blue-600 hover:text-blue-800 hover:underline">How can you contact us about this notice?</a></li>
            <li><a href="#request" className="text-blue-600 hover:text-blue-800 hover:underline">How can you review, update, or delete the data we collect from you?</a></li>
          </ol>
        </section>

        <hr className="border-gray-200 my-8" />

        {/* Detailed Sections */}
        <div className="space-y-10 text-gray-800 leading-relaxed text-sm">
          
          {/* Section 1 */}
          <section id="collect" className="space-y-4 scroll-mt-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-1 border-gray-100">
              1. WHAT INFORMATION DO WE COLLECT?
            </h3>
            <div className="space-y-3">
              <h4 className="font-bold text-gray-950">Personal information you disclose to us</h4>
              <p className="italic text-gray-600"><strong>In Short:</strong> We collect personal information that you provide to us.</p>
              <p>
                We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
              </p>
              <p className="font-semibold text-gray-900">Personal Information Provided by You:</p>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 list-disc pl-5 marker:text-[#FFA500]">
                <li>names</li>
                <li>phone numbers</li>
                <li>email addresses</li>
                <li>mailing addresses</li>
                <li>contact preferences</li>
                <li>passwords</li>
                <li>billing addresses</li>
                <li>debit/credit card numbers</li>
                <li>usernames</li>
                <li>contact or authentication data</li>
              </ul>

              <div className="mt-4 space-y-2">
                <p><strong>Sensitive Information:</strong> We do not process sensitive information.</p>
                <p>
                  <strong>Payment Data:</strong> We may collect data necessary to process your payment if you choose to make purchases, such as your payment instrument number, and the security code associated with your payment instrument. All payment data is handled and stored by Paystack. You may find their privacy notice link(s) here:{' '}
                  <a href="https://paystack.com/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    https://paystack.com/terms
                  </a>.
                </p>
                <p>
                  <strong>Social Media Login Data:</strong> We may provide you with the option to register with us using your existing social media account details, like your Facebook, X, or other social media account.
                </p>
                <p>
                  <strong>Google API:</strong> Our use of information received from Google APIs will adhere to{' '}
                  <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Google API Services User Data Policy
                  </a>, including the Limited Use requirements.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section id="process" className="space-y-4 scroll-mt-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-1 border-gray-100">
              2. HOW DO WE PROCESS YOUR INFORMATION?
            </h3>
            <div className="space-y-3">
              <p className="italic text-gray-600"><strong>In Short:</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.</p>
              <p className="font-semibold text-gray-950">We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</p>
              <ul className="space-y-2 list-disc pl-5 marker:text-[#FFA500]">
                <li><strong>To facilitate account creation and authentication and otherwise manage user accounts:</strong> We may process your information so you can create and log in to your account, as well as keep your account in working order.</li>
                <li><strong>To deliver and facilitate delivery of services to the user:</strong> We may process your information to provide you with the requested service.</li>
                <li><strong>To respond to user inquiries/offer support to users:</strong> We may process your information to respond to your inquiries and solve any potential issues you might have with the requested service.</li>
                <li><strong>To send administrative information to you:</strong> We may process your information to send you details about our products and services, changes to our terms and policies, and other similar information.</li>
                <li><strong>To fulfil and manage your orders:</strong> We may process your information to fulfil and manage your orders, payments, returns, and exchanges made through the Services.</li>
                <li><strong>To enable user-to-user communications:</strong> We may process your information if you choose to use any of our offerings that allow for communication with another user.</li>
                <li><strong>To request feedback:</strong> We may process your information when necessary to request feedback and to contact you about your use of our Services.</li>
                <li><strong>To send you marketing and promotional communications:</strong> We may process the personal information you send to us for our marketing purposes, if this is in accordance with your marketing preferences.</li>
                <li><strong>To deliver targeted advertising to you:</strong> We may process your information to develop and display personalised content and advertising tailored to your interests, location, and more.</li>
                <li><strong>To post testimonials:</strong> We post testimonials on our Services that may contain personal information.</li>
                <li><strong>To protect our Services:</strong> We may process your information as part of our efforts to keep our Services safe and secure, including fraud monitoring and prevention.</li>
                <li><strong>To administer prize draws and competitions:</strong> We may process your information to administer prize draws and competitions.</li>
                <li><strong>To evaluate and improve our Services, products, marketing, and your experience:</strong> We may process your information when we believe it is necessary to identify usage trends, determine the effectiveness of our promotional campaigns, and to evaluate and improve our Services, products, marketing, and your experience.</li>
                <li><strong>To identify usage trends:</strong> We may process information about how you use our Services to better understand how they are being used so we can improve them.</li>
                <li><strong>To determine the effectiveness of our marketing and promotional campaigns:</strong> We may process your information to better understand how to provide marketing and promotional campaigns that are most relevant to you.</li>
                <li><strong>To comply with our legal obligations:</strong> We may process your information to comply with our legal obligations, respond to legal requests, and exercise, establish, or defend our legal rights.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section id="share" className="space-y-4 scroll-mt-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-1 border-gray-100">
              3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
            </h3>
            <div className="space-y-3">
              <p className="italic text-gray-600"><strong>In Short:</strong> We may share information in specific situations described in this section and/or with the following categories of third parties.</p>
              <p>
                <strong>Vendors, Consultants, and Other Third-Party Service Providers:</strong> We may share your data with third-party vendors, service providers, contractors, or agents (&apos;third parties&apos;) who perform services for us or on our behalf and require access to such information to do that work.
              </p>
              <p className="font-semibold text-gray-950">The categories of third parties we may share personal information with are as follows:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 list-disc pl-5 marker:text-[#FFA500] mb-4">
                <li>Ad Networks</li>
                <li>Affiliate Marketing Programs</li>
                <li>AI Platforms</li>
                <li>Communication & Collaboration Tools</li>
                <li>Data Analytics Services</li>
                <li>Finance & Accounting Tools</li>
                <li>Data Storage Service Providers</li>
                <li>Government Entities</li>
                <li>Payment Processors</li>
                <li>Order Fulfilment Service Providers</li>
                <li>Performance Monitoring Tools</li>
                <li>Sales & Marketing Tools</li>
                <li>Social Networks</li>
                <li>User Account Registration & Authentication Services</li>
                <li>Website Hosting Service Providers</li>
              </ul>

              <p className="mt-4 pt-2 font-medium">We also may need to share your personal information in the following situations:</p>
              <ul className="list-disc pl-6 space-y-3 marker:text-[#FFA500]">
                <li>
                  <strong>Business Transfers.</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
                </li>
                <li>
                  <strong>Affiliates.</strong> We may share your information with our affiliates, in which case we will require those affiliates to honour this Privacy Notice. Affiliates include our parent company and any subsidiaries, joint venture partners, or other companies that we control or that are under common control with us.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section id="cookies" className="space-y-4 scroll-mt-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-1 border-gray-100">
              4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
            </h3>
            <div className="space-y-3">
              <p className="italic text-gray-600"><strong>In Short:</strong> We may use cookies and other tracking technologies to collect and store your information.</p>
              <p>
                We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Some online tracking technologies help us maintain the security of our Services and your account, prevent crashes, fix bugs, save your preferences, and assist with basic site functions.
              </p>
              <p>
                We also permit third parties and service providers to use online tracking technologies on our Services for analytics and advertising, including to help manage and display advertisements, to tailor advertisements to your interests, or to send abandoned shopping cart reminders (depending on your communication preferences). The third parties and service providers use their technology to provide advertising about products and services tailored to your interests which may appear either on our Services or on other websites.
              </p>
              <p>
                Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section id="social" className="space-y-4 scroll-mt-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-1 border-gray-100">
              5. HOW DO WE HANDLE YOUR SOCIAL LOGINS?
            </h3>
            <div className="space-y-3">
              <p className="italic text-gray-600"><strong>In Short:</strong> If you choose to register or log in to our Services using a social media account, we may have access to certain information about you.</p>
              <p>
                Our Services offer you the ability to register and log in using your third-party social media account details (like your Facebook or X logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile information we receive may vary depending on the social media provider concerned, but will often include your name, email address, friends list, and profile picture, as well as other information you choose to make public on such a social media platform.
              </p>
              <p>
                We will use the information we receive only for the purposes that are described in this Privacy Notice or that are otherwise made clear to you on the relevant Services. Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider. We recommend that you review their privacy notice to understand how they collect, use, and share your personal information, and how you can set your privacy preferences on their sites and apps.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="duration" className="space-y-4 scroll-mt-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-1 border-gray-100">
              6. HOW LONG DO WE KEEP YOUR INFORMATION?
            </h3>
            <div className="space-y-3">
              <p className="italic text-gray-600"><strong>In Short:</strong> We keep your information for as long as necessary to fulfil the purposes outlined in this Privacy Notice unless otherwise required by law.</p>
              <p>
                We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.
              </p>
              <p>
                When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymise such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="security" className="space-y-4 scroll-mt-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-1 border-gray-100">
              7. HOW DO WE KEEP YOUR INFORMATION SAFE?
            </h3>
            <div className="space-y-3">
              <p className="italic text-gray-600"><strong>In Short:</strong> We aim to protect your personal information through a system of organisational and technical security measures.</p>
              <p>
                We have implemented appropriate and reasonable technical and organisational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorised third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section id="rights" className="space-y-4 scroll-mt-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-1 border-gray-100">
              8. WHAT ARE YOUR PRIVACY RIGHTS?
            </h3>
            <div className="space-y-3">
              <p className="italic text-gray-600"><strong>In Short:</strong> You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.</p>
              <p>
                <strong>Withdrawing your consent:</strong> If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section <a href="#contact" className="text-blue-600 hover:underline">&apos;HOW CAN YOU CONTACT US ABOUT THIS NOTICE?&apos;</a> below.
              </p>
              <p>
                However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.
              </p>
              <p>
                <strong>Opting out of marketing and promotional communications:</strong> You can unsubscribe from our marketing and promotional communications at any time by clicking on the unsubscribe link in the emails that we send, or by contacting us using the details provided in the section <a href="#contact" className="text-blue-600 hover:underline">&apos;HOW CAN YOU CONTACT US ABOUT THIS NOTICE?&apos;</a> below. You will then be removed from the marketing lists. However, we may still communicate with you — for example, to send you service-related messages that are necessary for the administration and use of your account, to respond to service requests, or for other non-marketing purposes.
              </p>

              <h4 className="font-bold text-gray-950 mt-6 text-base">Account Information</h4>
              <p>If you would at any time like to review or change the information in your account or terminate your account, you can:</p>
              <ul className="list-disc pl-6 space-y-1 marker:text-[#FFA500]">
                <li>Contact us using the contact information provided.</li>
              </ul>
              <p>
                Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.
              </p>
              <p>
                <strong>Cookies and similar technologies:</strong> Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services.
              </p>
              <p>
                If you have questions or comments about your privacy rights, you may email us at{' '}
                <a href="mailto:studentshopng.info@gmail.com" className="text-[#FFA500] hover:underline font-semibold">
                  studentshopng.info@gmail.com
                </a>.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section id="dnt" className="space-y-4 scroll-mt-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-1 border-gray-100">
              9. CONTROLS FOR DO-NOT-TRACK FEATURES
            </h3>
            <div className="space-y-3">
              <p>
                Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (&apos;DNT&apos;) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognising and implementing DNT signals has been finalised. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Notice.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section id="updates" className="space-y-4 scroll-mt-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-1 border-gray-100">
              10. DO WE MAKE UPDATES TO THIS NOTICE?
            </h3>
            <div className="space-y-3">
              <p className="italic text-gray-600"><strong>In Short:</strong> Yes, we will update this notice as necessary to stay compliant with relevant laws.</p>
              <p>
                We may update this Privacy Notice from time to time. The updated version will be indicated by an updated &apos;Revised&apos; date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section id="contact" className="space-y-4 scroll-mt-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-1 border-gray-100">
              11. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
            </h3>
            <div className="space-y-3">
              <p>
                If you have questions or comments about this notice, you may email us at{' '}
                <a href="mailto:studentshopng.info@gmail.com" className="text-[#FFA500] hover:underline font-semibold">
                  studentshopng.info@gmail.com
                </a>{' '}
                or contact us by post at:
              </p>
              <div className="bg-gray-50 border border-gray-200 p-5 rounded-md text-gray-700 space-y-1 font-mono text-xs max-w-sm">
                <p className="font-bold text-gray-900 text-sm font-sans mb-1">Student Shop Nigeria Limited</p>
                <p>No 5 NYSC Road Alakahia</p>
                <p>Port Harcourt, Rivers 500001</p>
                <p>Nigeria</p>
              </div>
            </div>
          </section>

          {/* Section 12 */}
          <section id="request" className="space-y-4 scroll-mt-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-1 border-gray-100">
              12. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
            </h3>
            <div className="space-y-3">
              <p>
                You have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. To request to review, update, or delete your personal information, please visit:{' '}
                <a href="mailto:studentshopng.info@gmail.com" className="text-[#FFA500] hover:underline font-semibold">
                  studentshopng.info@gmail.com
                </a>.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;