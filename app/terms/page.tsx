"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-primary font-sans p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-gray-500 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
          <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-teal-600">
            Terms and Conditions
          </h1>

          <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
                  1
                </span>
                Acceptance of Terms
              </h2>
              <p>
                By accessing or using the TeenHut platform, applications,
                services, features, or content (collectively, the "Service"),
                you agree to be bound by these Terms and Conditions ("Terms"),
                all policies and guidelines incorporated by reference (including
                the Privacy Policy and Community Guidelines), and all applicable
                laws and regulations. If you do not agree to these Terms, you
                are prohibited from using or accessing the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
                  2
                </span>
                Eligibility, Age Restriction, and Parental Consent
              </h2>
              <div className="space-y-4">
                <p>
                  <strong>Age Requirement:</strong> TeenHut is designed for
                  individuals who are teenagers. By using the Service, you
                  affirm that you are typically between the ages of 13 and 19.
                </p>
                <p>
                  <strong>Users Under 18 (Minor Consent):</strong> If you are
                  under the age of 18, you represent and warrant that you have
                  obtained permission from your parent or legal guardian to use
                  the Service. Your parent or guardian must review these Terms
                  with you and agree to them on your behalf.
                </p>
                <p>
                  <strong>Parent/Guardian Acceptance:</strong> If you are a
                  parent or guardian permitting a minor to use the Service, you
                  agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Supervise the minor's use of the Service.</li>
                  <li>
                    Assume all risks associated with the minor's use of the
                    Service.
                  </li>
                  <li>
                    Assume any liability resulting from the minor's use of the
                    Service.
                  </li>
                  <li>
                    Ensure the accuracy and truthfulness of all information
                    submitted by the minor.
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
                  3
                </span>
                User Accounts and Security
              </h2>
              <div className="space-y-4">
                <p>
                  <strong>Account Creation:</strong> You must register for an
                  account to access most features of the Service. You agree to
                  provide accurate, current, and complete information during the
                  registration process.
                </p>
                <p>
                  <strong>Security:</strong> You are responsible for
                  safeguarding your password and for all activities that occur
                  under your account. You agree to notify TeenHut immediately if
                  you suspect any unauthorized use of your account. TeenHut is
                  not liable for any loss or damage arising from your failure to
                  comply with this security obligation.
                </p>
                <p>
                  <strong>One Account:</strong> You may only maintain one
                  account on the TeenHut Service.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
                  4
                </span>
                User Conduct and Detailed Community Guidelines
              </h2>
              <p className="mb-4">
                The TeenHut platform is a positive, safe, and empowering space
                committed to the core value of "Empower others." Behavior that
                is contrary to this mission is strictly prohibited.
              </p>
              <p className="mb-2 font-semibold">
                Prohibited Conduct (Zero Tolerance):
              </p>
              <p className="mb-4">
                You agree that in all interactions on the Service (posts, chats,
                comments, content creation, etc.), you will not engage in:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>
                  <strong>Abusive Language:</strong> Any language that is
                  abusive, hateful, harassing, discriminatory, threatening,
                  intimidating, or promotes violence or self-harm.
                </li>
                <li>
                  <strong>Bullying/Trolling:</strong> Posting content intended
                  to harass, defame, or victimize another person or group.
                </li>
                <li>
                  <strong>Spam or Phishing:</strong> Unsolicited commercial
                  advertising or attempts to compromise user security.
                </li>
                <li>
                  <strong>Impersonation:</strong> Pretending to be another
                  person, entity, or a TeenHut administrator/employee.
                </li>
                <li>
                  <strong>Disclosure of Private Information:</strong> Sharing
                  the private or confidential information of others without
                  their explicit consent.
                </li>
              </ul>
              <p>
                <strong>Consequences of Violation:</strong> Any violation of
                this Section 4 will result in the immediate and permanent
                suspension or banning of your account, removal of associated
                content, and potential reporting to law enforcement, at the sole
                discretion of the TeenHut administration.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
                  5
                </span>
                Content Ownership, Intellectual Property, and Content License
              </h2>
              <div className="space-y-4">
                <p>
                  <strong>Your Content (User Content):</strong> You retain all
                  ownership rights to the content you create and post on TeenHut
                  (e.g., videos, blogs, advice, tutorials). You are solely
                  responsible for your User Content and the consequences of
                  posting or publishing it.
                </p>
                <p>
                  <strong>Warranties:</strong> You warrant that your User
                  Content does not infringe upon the copyrights, trademarks,
                  privacy rights, publicity rights, or other intellectual
                  property rights of any person or entity.
                </p>
                <p>
                  <strong>License Granted to TeenHut:</strong> By posting User
                  Content, you grant TeenHut a worldwide, non-exclusive,
                  royalty-free, fully paid, perpetual, irrevocable, transferable
                  license (with the right to sublicense) to use, reproduce,
                  distribute, display, perform, and prepare derivative works of
                  your User Content in connection with the operation, promotion,
                  and improvement of the Service.
                </p>
                <p>
                  <strong>TeenHut Content:</strong> All content, graphics,
                  logos, and features of the Service (excluding User Content)
                  are owned by TeenHut and are protected by copyright and
                  intellectual property laws.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
                  6
                </span>
                TeenHut Access and Participation
              </h2>
              <div className="space-y-4">
                <p>
                  <strong>Freemium Access:</strong> The Freemium plan grants
                  basic, free access to essential features, learning hubs, and
                  the community feed. TeenHut reserves the right to modify the
                  features included in the Freemium plan at any time.
                </p>
                <p>
                  <strong>Roles:</strong> Users may participate as Learners,
                  Creators, or Mentors. TeenHut does not guarantee that any
                  Creator or Mentor role will result in specific outcomes,
                  learning, or experience.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
                  7
                </span>
                Disclaimers and Limitations of Liability
              </h2>
              <div className="space-y-4">
                <p>
                  <strong>"Learn by Doing" Disclaimer:</strong> TeenHut
                  emphasizes "Learn by doing" but provides content for
                  informational and educational purposes only. TeenHut is not
                  responsible for the accuracy, utility, or safety of any
                  instruction or advice provided by other users (Creators or
                  Mentors). Users assume all risk for reliance on User Content.
                </p>
                <p>
                  <strong>Warranty Disclaimer:</strong> The Service is provided
                  on an "as is" and "as available" basis, without warranties of
                  any kind, either express or implied, including, but not
                  limited to, implied warranties of merchantability, fitness for
                  a particular purpose, or non-infringement.
                </p>
                <p>
                  <strong>Limitation of Liability:</strong> To the maximum
                  extent permitted by applicable law, in no event shall TeenHut,
                  its affiliates, directors, or employees be liable for any
                  indirect, incidental, special, consequential, or punitive
                  damages, or any loss of profits or revenues, whether incurred
                  directly or indirectly, or any loss of data, use, goodwill, or
                  other intangible losses, resulting from (a) your access to or
                  use of or inability to access or use the Service; (b) any
                  conduct or content of any third party on the Service.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
                  8
                </span>
                Changes to the Terms
              </h2>
              <p>
                TeenHut reserves the right to modify or replace these Terms at
                any time. If a revision is material, we will provide at least 30
                days' notice prior to any new terms taking effect. By continuing
                to access or use our Service after those revisions become
                effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
                  9
                </span>
                Termination
              </h2>
              <p>
                TeenHut may terminate or suspend your access to the Service
                immediately, without prior notice or liability, for any reason
                whatsoever, including, without limitation, if you breach these
                Terms (especially Section 4). Upon termination, your right to
                use the Service will immediately cease.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
