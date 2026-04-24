import { getUserAllExperience, getUserBio, getUserExperience, getUserSkills } from "@/app/actions/authActions.server";
import { getOwnPosts } from "@/app/actions/postActions.server";
import { auth } from "@/auth";
import { DeleteUserExperience } from "@/components/buttons/delete-experience-btn";
import { AddUpdateBioPopover } from "@/components/poper/add-update-bio";
import { AddUpdateExperiencePopover } from "@/components/poper/add-update-experience";
import { AddUpdateSkillPopover } from "@/components/poper/add-update-skills";
import { Badge, Box, Button, Card, Flex, Heading, Inset, ScrollArea, Text } from "@radix-ui/themes";
import { DeleteIcon, FacebookIcon, FactoryIcon, GithubIcon, InstagramIcon, Tag, TwitterIcon, YoutubeIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  const session = await auth();

  const user = session?.user; 
  
  const bio = await getUserBio(String(user?.id));
  const workExperience = await getUserAllExperience(user?.id as string);
  const userSkill = await getUserSkills(user?.id as string);
  const posts = await getOwnPosts(user?.id as string);

  if (!session?.user) return redirect("/authentication");
  
  return (
    <Box maxWidth="1366px" className="mx-4 my-16 md:mx-30 md:my-28">
      <Flex className="flex-col md:flex-row" justify="between" content="center">

        {/** Left side contents */}
        <Flex direction="column" justify="start" gapY="4" className="w-full md:w-[30vw] h-full md:h-[92vh]" asChild>
          <Card size="1">
            <Inset clip="padding-box" side="top" pb="current">
              <img 
                src={user?.image ?? "/images/mape.png"} 
                alt="Profile" 
              />
            </Inset>
            <Heading as="h3" color="gray" size="4" weight="medium">
              {user?.name}
            </Heading>
            <Text as="p" size="1">
              {user?.email}
            </Text>

            {/** Edit button */}
            <Flex my="4" asChild>
              <Link 
                href={"/profile"}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Edit
              </Link>
            </Flex>

            {/** Skills Data */}
            <Flex direction="column" justify="between">
              <Flex 
                direction="row" 
                justify="between"
                style={{ backgroundColor: "gray", alignItems: "center" }}
                px={"3"}
                py="1"
              >
                <Heading as="h3" size="3">
                  Skills
                </Heading>
                <AddUpdateSkillPopover skill={null} />
              </Flex>
              <ScrollArea type="always" scrollbars="vertical" style={{ height: 180 }}>
                <Flex direction="column" gap="1" my="4" mx="2">
                  {userSkill?.length > 0 
                    ? userSkill?.map((skill) => 
                      <Flex key={skill.id}>
                        <Tag 
                          width={"12"} height={"12"} 
                          className="rotate-90 text-teal-700 mr-1"
                        />
                        <Text 
                          size="1" 
                          color="teal"
                        >{skill?.text}</Text>
                      </Flex>
                      )
                    : <Text size="1" mx="8" my="4" color="orange">No skills yet, add</Text>
                  }
                </Flex>
              </ScrollArea>
            </Flex>
          </Card>
        </Flex>

        {/** Right side contents */}
        <Flex direction="column" justify="start" gapY="4" className="w-full md:w-screen" asChild>
          <Card size="1">
            <Flex as="div" direction="column" gap="4">

              {/** ABout Me Data */}
              <Flex 
                direction="row" 
                width={"full"} 
                justify={"between"}
                px={"4"}
                py="2"
                align={"center"}
                style={{ backgroundColor: "gray", color: "#ffe" }}
              >
                <Heading as="h3">About Me</Heading>
                <AddUpdateBioPopover bio={bio} />
              </Flex>
              <Text as="div" size={"2"} mx="4">
                <pre
                  className="font-light text-sm font-sans text-wrap"
                >{bio?.text}</pre>
              </Text>

              {/** Social Media Channels */}
              <Flex direction={"column"} my="6">
                <Heading 
                  as="h3" 
                  align={"center"}
                >My Social Media Channels</Heading>
                <Flex justify={"center"} gap={"2"}>
                  <FacebookIcon />
                  <TwitterIcon />
                  <GithubIcon />
                </Flex>
              </Flex>

              {/** Work Experience Data */}
              <Flex
                direction={"column"}
              >
                <Flex 
                  direction={"row"} 
                  justify={"between"} 
                  align={"center"} 
                  style={{  backgroundColor: "gray", color: '#ffe' }}
                  px='4'
                  py='2'
                >
                  <Heading as="h3">
                    Work Experience
                  </Heading>
                  <AddUpdateExperiencePopover workExperience={null} />
                </Flex>
                <ScrollArea type="always" scrollbars="vertical" style={{ height: 380 }}>
                {workExperience.length > 0
                  ? workExperience.map((exp) => (
                    <Flex key={exp.id} direction={"column"} justify={"between"} px="4" py='2'>
                      <Flex direction="row" wrap={"wrap"} justify={"between"} align="center" className="text-sm">
                        <Text as="span" className="text-gray-800 font-semibold">
                          {exp.jobTitle}
                        </Text>
                        <Flex direction="row" gap="6">
                          <Text as="span">
                            {exp.companyName}
                          </Text>
                          <Text as="span" className="text-gray-600">
                            {exp.dates}
                          </Text>
                        </Flex>
                        <Flex direction="row" gap="5">
                          <AddUpdateExperiencePopover workExperience={exp} />
                          <DeleteUserExperience id={exp.id} />
                        </Flex>
                      </Flex>
                      <Text as="div">
                        <pre className="mt-1 ml-2 text-xs text-wrap font-normal font-sans dark: text-gray-500">{exp.duties}</pre>
                      </Text>
                    </Flex>
                  ))
                  : <Text size={"2"} mx={"4"} my={"2"} color="red"> No data available </Text>
                }
                </ScrollArea>
              </Flex>
              <Flex direction="column" gap="4">
                <Flex 
                  direction="row" 
                  justify="between" 
                  style={{  backgroundColor: "gray", color: '#ffe' }}
                  px="4"
                  py="2"
                  align="center"
                >
                  <Heading as="h3">
                    Publications
                  </Heading>
                  <Button size="1" variant="ghost">Visit blog area</Button>
                </Flex>
                <Box>
                  <Flex direction="row" wrap='wrap' gap="4" px='4'>
                    {posts
                      ? posts.map((post) => 
                          <Card 
                            size="1" 
                            key={post.id}
                            style={{ backgroundColor: "blue" }}
                          >
                            {post.title} <Badge>
                              {post.published ? "Published" : "Draft"}
                            </Badge>
                          </Card>
                        )
                      : "No posts poblished yet. Write something"
                    }
                  </Flex>
                </Box>
              </Flex>
            </Flex>
          </Card>
        </Flex>
      </Flex>
    </Box>
  );
}

export default ProfilePage;
