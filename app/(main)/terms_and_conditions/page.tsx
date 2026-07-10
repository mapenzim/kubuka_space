import { Container, Heading, Text, Section, Flex, Box, Separator, Link } from "@radix-ui/themes";

export default function TermsAndConditionsPage() {
  return (
    <Container size="3" px="4" mt="8" pb="8" className="bg-gray-100 dark:bg-zinc-800 dark:text-gray-300">
      <Section size="3">
        <Flex direction="column" gap="6">
          
          {/* Header */}
          <Box>
            <Heading as="h1" size="8" mb="2">
              Terms and Conditions for Kubuka
            </Heading>
            <Text as="p" color="gray" size="2" className="italic dark:text-gray-500!">
              Last Updated: May 3, 2026
            </Text>
          </Box>

          <Text as="p" size="1" className="leading-relaxed">
            Welcome to Kubuka ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your access to and use of the Kubuka website, applications, and services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
          </Text>

          <Separator size="4" />

          {/* Section 1 */}
          <Box>
            <Heading as="h2" size="5" mb="3">
              1. User Accounts and Authentication
            </Heading>
            <Text as="p" size="3" mb="2" className="leading-relaxed">
              To access certain features of the Service (such as publishing posts or completing a purchase), you must register for an account.
            </Text>
            <Flex direction="column" gap="2" pl="4" asChild>
              <ul className="list-disc text-gray-700 dark:text-gray-300">
                <li>
                  <Text as="span" weight="bold">Accuracy of Information: </Text>
                  You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                </li>
                <li>
                  <Text as="span" weight="bold">Account Security: </Text>
                  You are responsible for safeguarding the password and authentication credentials that you use to access the Service. You agree not to disclose your password to any third party.
                </li>
                <li>
                  <Text as="span" weight="bold">Account Termination: </Text>
                  We reserve the right to suspend or terminate your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </li>
              </ul>
            </Flex>
          </Box>

          {/* Section 2 */}
          <Box>
            <Heading as="h2" size="5" mb="3">
              2. User-Generated Content
            </Heading>
            <Text as="p" size="3" mb="2" className="leading-relaxed">
              Kubuka allows users to author, edit, and publish content, including but not limited to text, images, and links ("Content").
            </Text>
            <Flex direction="column" gap="2" pl="4" asChild>
              <ul className="list-disc text-gray-700 dark:text-gray-300">
                <li>
                  <Text as="span" weight="bold">Ownership: </Text>
                  You retain any and all of your rights to any Content you submit, post, or display on or through the Service.
                </li>
                <li>
                  <Text as="span" weight="bold">License to Kubuka: </Text>
                  By posting Content on or through the Service, you grant us a worldwide, non-exclusive, royalty-free, transferable license to use, modify, publicly display, reproduce, and distribute such Content.
                </li>
                <li>
                  <Text as="span" weight="bold">Prohibited Content: </Text>
                  You agree not to post Content that is unlawful, defamatory, harassing, infringes on intellectual property rights, or contains malicious software.
                </li>
              </ul>
            </Flex>
          </Box>

          {/* Section 3 */}
          <Box>
            <Heading as="h2" size="5" mb="3">
              3. E-commerce and Store
            </Heading>
            <Text as="p" size="3" mb="2" className="leading-relaxed">
              Kubuka includes a marketplace/store where users can add items to a cart and make purchases.
            </Text>
            <Flex direction="column" gap="2" pl="4" asChild>
              <ul className="list-disc text-gray-700 dark:text-gray-300">
                <li>
                  <Text as="span" weight="bold">Pricing and Availability: </Text>
                  All prices are subject to change without notice. We reserve the right to modify or discontinue products at any time.
                </li>
                <li>
                  <Text as="span" weight="bold">Order Acceptance: </Text>
                  We reserve the right to refuse or cancel any order for any reason, including errors in the description or price.
                </li>
                <li>
                  <Text as="span" weight="bold">Payments: </Text>
                  All payments must be made through our approved third-party payment processors.
                </li>
              </ul>
            </Flex>
          </Box>

          {/* Section 4 */}
          <Box>
            <Heading as="h2" size="5" mb="3">
              4. Intellectual Property
            </Heading>
            <Text as="p" size="3" className="leading-relaxed">
              The Service and its original content (excluding User-Generated Content), features, and functionality are and will remain the exclusive property of Kubuka and its licensors. The Service is protected by copyright, trademark, and other laws.
            </Text>
          </Box>

          {/* Section 5 */}
          <Box>
            <Heading as="h2" size="5" mb="3">
              5. Limitation of Liability
            </Heading>
            <Text as="p" size="3" className="leading-relaxed">
              In no event shall Kubuka, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </Text>
          </Box>

          {/* Section 6 */}
          <Box>
            <Heading as="h2" size="5" mb="3">
              6. Disclaimer
            </Heading>
            <Text as="p" size="3" className="leading-relaxed">
              Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied.
            </Text>
          </Box>

          {/* Section 7 */}
          <Box>
            <Heading as="h2" size="5" mb="3">
              7. Governing Law
            </Heading>
            <Text as="p" size="3" className="leading-relaxed">
              These Terms shall be governed and construed in accordance with the laws of Zimbabwe, without regard to its conflict of law provisions.
            </Text>
          </Box>

          {/* Section 8 */}
          <Box>
            <Heading as="h2" size="5" mb="3">
              8. Contact Us
            </Heading>
            <Text as="p" size="3" className="leading-relaxed">
              If you have any questions about these Terms, please contact us at:
            </Text>
            <Flex direction="column" gap="1" mt="2">
              <Text as="p" size="3">
                <Text weight="bold">Email: </Text>
                <Link href="mailto:support@kubuka.space" color="pink" className="dark:text-zinc-400!">support@kubuka.space</Link>
              </Text>
              <Text as="p" size="3">
                <Text weight="bold">Website: </Text>
                <Link href="https://kubuka.space/terms_and_conditions" color="pink" referrerPolicy="no-referrer" target="__blank"className="dark:text-zinc-400!">
                  https://kubuka.space
                </Link>
              </Text>
            </Flex>
          </Box>

        </Flex>
      </Section>
    </Container>
  );
}