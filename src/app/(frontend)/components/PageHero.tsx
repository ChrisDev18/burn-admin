import {Box, Container, Flex, Heading, IconButton, Text} from "@radix-ui/themes";
import * as React from "react";
import {IconProps} from "@radix-ui/react-icons/dist/types";
import Link from "next/link";
import {ArrowLeftIcon} from "@radix-ui/react-icons";

type PageHeroProps = {
  layout: "editForm"
  title: string,
  header: string,
  titlePlaceholder: string,
  back?: string,
} | {
  layout: "main"
  title: string,
  messages: string[],
  Icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>
}

export default function PageHero(props: PageHeroProps) {
  return (
    <Box width={"100%"}>
      <Container size="4" height="100%" p="6" style={{backgroundColor: "var(--accent-3)", borderBottom: "1px solid var(--accent-6)"}}>
        { props.layout === "main" ? <>
            <Flex align="center" gap="3" mb="4">
              <props.Icon style={{color: "var(--accent-11)"}} height={30} width={30}/>
              <Heading id="heading" style={{color: "var(--accent-11)"}}>{props.title}</Heading>
            </Flex>
            <Flex direction="column" gap="1">
              {props.messages.map((message, i) => (
                  <Text key={i} weight="medium" style={{color: "var(--accent-12)"}}>{message}</Text>
              ))}
            </Flex>
        </> : <>
          <Flex align="center" gap="4">
            { props.back &&
                <IconButton variant="ghost" size="2" asChild>
                  <Link href={props.back}>
                    <ArrowLeftIcon height={24} width={24}/>
                  </Link>
                </IconButton>
            }

            <Flex direction="column">
              <Text style={{color: "var(--accent-11)"}}>{props.header}</Text>
              { props.title !== "" ? (
                  <Heading style={{color: "var(--accent-11)"}}>{props.title}</Heading>
              ) : (
                  <Heading style={{color: "var(--accent-7)"}}>{props.titlePlaceholder}</Heading>
              )}
            </Flex>
          </Flex>
        </>
      }
      </Container>
    </Box>
  )
}