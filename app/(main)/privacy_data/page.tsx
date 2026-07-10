import { Container, Heading, Text, Section, Flex, Box, Separator, Link } from "@radix-ui/themes";

export default function PrivacyAndLicencePolicyPage() {
  return (
    <Container size="3" px="4" mt="8" pb="8" className="bg-gray-100 dark:bg-zinc-800 dark:text-gray-300">
      <Section size="3">
        <Flex direction="column" gap="6">
          
          {/* Header */}
          <Box>
            <Heading as="h1" size="8" mb="2">
              Data Protection, Privacy, and Licence Policy
            </Heading>
            <Text as="p" color="gray" size="2" className="italic dark:text-gray-500!">
              Last Updated: May 3, 2026
            </Text>
          </Box>

          <Text as="p" size="1" className="leading-relaxed">
            At Kubuka ("we," "our," or "us"), we are committed to protecting your personal data and respecting your privacy. This policy outlines how we collect, use, store, and share your data, as well as the licensing terms governing your use of our platform and the content you create.
          </Text>

          <Separator size="4" />

          {/* Part 1: Data Protection & Privacy */}
          <Box>
            <Heading as="h2" size="6" mb="4" color="indigo">
              Part 1: Data Protection and Privacy
            </Heading>
            
            <Heading as="h3" size="5" mb="3">
              1. Information We Collect
            </Heading>
            <Text as="p" size="3" mb="2" className="leading-relaxed">
              We collect information to provide better services to all our users. The types of personal information we obtain include:
            </Text>
            <Flex direction="column" gap="2" pl="4" asChild>
              <ul className="list-disc text-gray-700 dark:text-gray-300">
                <li>
                  <Text as="span" weight="bold">Account Information: </Text>
                  When you register, we collect your name, email address, and authentication credentials.
                </li>
                <li>
                  <Text as="span" weight="bold">Profile & Content Data: </Text>
                  Information you provide when creating an author profile, including biographies, profile pictures, and the articles or posts you publish.
                </li>
                <li>
                  <Text as="span" weight="bold">E-commerce Data: </Text>
                  When you make a purchase in our store, we collect billing details, shipping addresses, and order history. (Note: Payment details are securely processed by our third-party payment providers; we do not store your full credit card numbers).
                </li>
                <li>
                  <Text as="span" weight="bold">Usage Data: </Text>
                  Information about how you interact with our website, including IP addresses, browser types, and device identifiers.
                </li>
              </ul>
            </Flex>
          </Box>

          <Box>
            <Heading as="h3" size="5" mb="3">
              2. How We Use Your Data
            </Heading>
            <Text as="p" size="3" mb="2" className="leading-relaxed">
              We use the data we collect for the following purposes:
            </Text>
            <Flex direction="column" gap="2" pl="4" asChild>
              <ul className="list-disc text-gray-700 dark:text-gray-300">
                <li>To provide, maintain, and improve the Kubuka platform.</li>
                <li>To process your e-commerce transactions and send related information, including purchase confirmations and invoices.</li>
                <li>To manage your account and provide customer support.</li>
                <li>To communicate with you about updates, security alerts, and administrative messages.</li>
              </ul>
            </Flex>
          </Box>

          <Box>
            <Heading as="h3" size="5" mb="3">
              3. Data Sharing and Disclosure
            </Heading>
            <Text as="p" size="3" className="leading-relaxed">
              We do not sell your personal data to third parties. We may share your information with trusted third-party service providers who assist us in operating our website, conducting our business, or processing payments, so long as those parties agree to keep this information confidential and comply with applicable data protection laws. We may also release information when its release is appropriate to comply with the law or protect our or others' rights, property, or safety.
            </Text>
          </Box>

          <Box>
            <Heading as="h3" size="5" mb="3">
              4. Your Data Rights
            </Heading>
            <Text as="p" size="3" className="leading-relaxed">
              Depending on your location, you may have the right to access, correct, update, or request deletion of your personal data. You also have the right to object to the processing of your data, ask us to restrict the processing of your data, or request portability of your personal information. To exercise any of these rights, please contact us using the information provided below.
            </Text>
          </Box>

          <Separator size="4" my="2" />

          {/* Part 2: Licence Policy */}
          <Box>
            <Heading as="h2" size="6" mb="4" color="indigo">
              Part 2: Licence Policy
            </Heading>

            <Heading as="h3" size="5" mb="3">
              5. Our Licence to You
            </Heading>
            <Text as="p" size="3" className="leading-relaxed">
              Subject to your compliance with these terms, Kubuka grants you a limited, non-exclusive, non-transferable, and revocable licence to access and use the Service for your personal or internal business purposes. You may not copy, modify, distribute, sell, or lease any part of our Service or included software, nor may you reverse engineer or attempt to extract the source code of that software.
            </Text>
          </Box>

          <Box>
            <Heading as="h3" size="5" mb="3">
              6. User-Generated Content Licence
            </Heading>
            <Text as="p" size="3" className="leading-relaxed">
              When you publish posts, articles, or other content on Kubuka, you retain your ownership rights. However, by uploading or publishing content, you grant Kubuka a worldwide, royalty-free, non-exclusive, transferable, and sublicensable licence to use, reproduce, distribute, display, and perform that user-generated content in connection with the Service and Kubuka's business operations, including promoting and redistributing part or all of the Service.
            </Text>
          </Box>

          <Separator size="4" my="2" />

          {/* Part 3: General */}
          <Box>
            <Heading as="h2" size="5" mb="3">
              7. Changes to this Policy
            </Heading>
            <Text as="p" size="3" className="leading-relaxed">
              We may update our Data Protection, Privacy, and Licence Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. You are advised to review this policy periodically for any changes.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="5" mb="3">
              8. Contact Us
            </Heading>
            <Text as="p" size="3" className="leading-relaxed">
              If you have any questions or concerns regarding your data privacy or these licensing terms, please reach out to our Data Protection Officer at:
            </Text>
            <Flex direction="column" gap="1" mt="2">
              <Text as="p" size="3">
                <Text weight="bold">Email: </Text>
                <Link href="mailto:privacy@kubuka.space" referrerPolicy="no-referrer" className="text-blue-500 hover:text-blue-700 dark:text-zinc-400!">privacy@kubuka.space</Link>
              </Text>
              <Text as="p" size="3">
                <Text weight="bold">Website: </Text>
                <Link href="https://kubuka.space/contact_us" referrerPolicy="no-referrer" className="text-blue-500 hover:text-blue-700 dark:text-zinc-400!">https://kubuka.space</Link>
              </Text>
            </Flex>
          </Box>

        </Flex>
      </Section>
    </Container>
  );
}