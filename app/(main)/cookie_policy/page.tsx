import { Container, Heading, Text, Section, Flex, Box, Separator, Link } from "@radix-ui/themes";

export default function CookiesPolicyPage() {
  return (
    <Container size="3" px="4" mt="8" pb="8" className="bg-gray-100 dark:bg-zinc-800 dark:text-gray-300">
      <Section size="3">
        <Flex direction="column" gap="6">
          
          {/* Header */}
          <Box>
            <Heading as="h1" size="8" mb="2">
              Cookies Policy for Kubuka
            </Heading>
            <Text as="p" color="gray" size="2" className="italic dark:text-gray-500!">
              Last Updated: May 3, 2026
            </Text>
          </Box>

          <Text as="p" size="1" className="leading-relaxed">
            This Cookies Policy explains how Kubuka ("we," "our," or "us") uses cookies and similar technologies to recognize you when you visit our website and use our services (the "Service"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </Text>

          <Separator size="4" />

          {/* Section 1 */}
          <Box>
            <Heading as="h2" size="5" mb="3">
              1. What are Cookies?
            </Heading>
            <Text as="p" size="3" className="leading-relaxed">
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
            </Text>
          </Box>

          {/* Section 2 */}
          <Box>
            <Heading as="h2" size="5" mb="3">
              2. Why Do We Use Cookies?
            </Heading>
            <Text as="p" size="3" mb="2" className="leading-relaxed">
              We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Service to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Service (such as keeping items in your shopping cart).
            </Text>
          </Box>

          {/* Section 3 */}
          <Box>
            <Heading as="h2" size="5" mb="3">
              3. Types of Cookies We Use
            </Heading>
            <Flex direction="column" gap="4" pl="4" asChild>
              <ul className="list-disc text-gray-700 dark:text-gray-300">
                <li>
                  <Text as="span" weight="bold">Essential Cookies: </Text>
                  These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas. This includes maintaining your active session so you can stay logged in while navigating the site.
                </li>
                <li>
                  <Text as="span" weight="bold">Performance and Functionality Cookies: </Text>
                  These are used to enhance the performance and functionality of our Service but are non-essential to their use. However, without these cookies, certain functionality (like your e-commerce cart data) may become unavailable.
                </li>
                <li>
                  <Text as="span" weight="bold">Analytics and Customization Cookies: </Text>
                  These cookies collect information that is used either in aggregate form to help us understand how our Service is being used or how effective our marketing campaigns are, or to help us customize our Service for you.
                </li>
              </ul>
            </Flex>
          </Box>

          {/* Section 4 */}
          <Box>
            <Heading as="h2" size="5" mb="3">
              4. Third-Party Cookies
            </Heading>
            <Text as="p" size="3" className="leading-relaxed">
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Service and deliver advertisements on and through the Service. For example, we use third-party payment processors for our store, which may place cookies on your browser to securely process your transactions and prevent fraud.
            </Text>
          </Box>

          {/* Section 5 */}
          <Box>
            <Heading as="h2" size="5" mb="3">
              5. Your Choices Regarding Cookies
            </Heading>
            <Text as="p" size="3" mb="2" className="leading-relaxed">
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in your web browser controls.
            </Text>
            <Flex direction="column" gap="2" pl="4" asChild>
              <ul className="list-disc text-gray-700 dark:text-gray-300">
                <li>
                  <Text as="span" weight="bold">Browser Controls: </Text>
                  You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website, but your access to some functionality and areas of our website (such as logging in or checking out of the store) may be severely restricted.
                </li>
                <li>
                  <Text as="span" weight="bold">Disabling Cookies: </Text>
                  As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser's help menu for more information.
                </li>
              </ul>
            </Flex>
          </Box>

          {/* Section 6 */}
          <Box>
            <Heading as="h2" size="5" mb="3">
              6. Changes to this Policy
            </Heading>
            <Text as="p" size="3" className="leading-relaxed">
              We may update this Cookies Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please revisit this Cookies Policy regularly to stay informed about our use of cookies and related technologies. The date at the top of this policy indicates when it was last updated.
            </Text>
          </Box>

          {/* Section 7 */}
          <Box>
            <Heading as="h2" size="5" mb="3">
              7. Contact Us
            </Heading>
            <Text as="p" size="3" className="leading-relaxed">
              If you have any questions about our use of cookies or other technologies, please contact us at:
            </Text>
            <Flex direction="column" gap="1" mt="2">
              <Text as="p" size="3">
                <Text weight="bold">Email: </Text>
                <Link href="mailto:privacy@kubuka.space" className="text-blue-500 hover:text-blue-700 dark:text-zinc-400!">
                  privacy@kubuka.space
                </Link>
              </Text>
              <Text as="p" size="3">
                <Text weight="bold">Website: </Text>
                <Link href="https://kubuka.space/contact_us" className="text-blue-500 hover:text-blue-700 dark:text-zinc-400!" referrerPolicy="no-referrer" target="__blank">
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