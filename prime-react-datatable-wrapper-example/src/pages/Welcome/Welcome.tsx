import { useState } from "react";
import { Modal, Button, Grid, Box, Title, Flex, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SearchableAdmin, typecastSearchableAdminJSON } from "../../schemas/models/Admin";
import { getApi } from "../../services/resolveApi";
import { LoadingData } from "../../components/LoadingData";
import { FilteredSortedSearchResults } from "../../components/DataTable/FilteredSortedSearchResults";
import { PrimaryIdNumberColumn } from "../../components/DataTable/Columns/PrimaryIdNumberColumn";
import { TextColumn } from "../../components/DataTable/Columns/TextColumn";
import { ExternalLinkColumn } from "../../components/DataTable/Columns/ExternalLinkColumn";
import { PhoneColumn } from "../../components/DataTable/Columns/PhoneColumn";
import { EmailColumn } from "../../components/DataTable/Columns/EmailLinkColumn";
import { DynamicSetColumn } from "../../components/DataTable/Columns/DynamicSetColumn";
import { ApiResponseData } from "../../schemas/models/ApiResponse";
import { useQuery } from "@tanstack/react-query";

export function AdminSearch() {
  const [searchableAdminList, setSearchableAdminList] = useState<SearchableAdmin[]>([]);

  useQuery({
    queryKey: ['admins'],
    queryFn: async ()=> {
      const api = await getApi(`/admin.json`);
      // checkFetchError(api, unsetAdmin);
      const loadedAdmins = (api.data as ApiResponseData[]).map(portfolio => {
        return typecastSearchableAdminJSON(portfolio);
      });
      setSearchableAdminList(loadedAdmins);
      return api;
    },
  });

  const [opened, { open, close }] = useDisclosure(false);

  const adminColumns = [
    PrimaryIdNumberColumn({
      field: "id",
      header: "#",
      data: searchableAdminList,
      link: {
        to: "/account/admins/$adminId",
        params: { adminId: "id" },
      },
    }),
    DynamicSetColumn({
      field: "statusLabel",
      header: "Status",
      data: searchableAdminList,
    }),
    DynamicSetColumn({
      field: "typeLabel",
      header: "Role",
      data: searchableAdminList,
    }),
    TextColumn({
      field: "first_name",
      header: "First Name",
      data: searchableAdminList,
    }),
    TextColumn({
      field: "last_name",
      header: "Last Name",
      data: searchableAdminList,
    }),
    TextColumn({
      field: "login",
      header: "Username",
      data: searchableAdminList,
    }),
    EmailColumn({
      field: "email_login",
      header: "Login Email",
      data: searchableAdminList,
    }),
    EmailColumn({
      field: "sponsor_email",
      header: "Sponsor Email",
      data: searchableAdminList,
    }),
    DynamicSetColumn({
      field: "sponsor_name",
      header: "Sponsor Name",
      data: searchableAdminList,
    }),
    PhoneColumn({
      field: "sponsor_phone1",
      header: "Primary Phone",
      data: searchableAdminList,
    }),
    PhoneColumn({
      field: "sponsor_phone2",
      header: "Secondary Phone",
      data: searchableAdminList,
    }),
    ExternalLinkColumn({
      field: "sponsor_website",
      header: "Sponsor Website",
      data: searchableAdminList,
    }),
  ];

  console.log('searchableAdminList', searchableAdminList);
  searchableAdminList.forEach((admin) => {
    console.log('admin.typeLabel', admin.typeLabel);
  });

  return (
    searchableAdminList && (
      <Box>
        <Modal
          size="xl"
          opened={opened}
          onClose={close}
          title="Create an Admin"
        >
          <Text>
            Add things
          </Text>
        </Modal>
        <Flex align="center" justify="space-between" pt={16}>
          <Title order={1}>Admins</Title>
          <div style={{ textAlign: "right" }}>
            <Button onClick={open} mr="xs">
              Add Admins
            </Button>
          </div>
        </Flex>
        {searchableAdminList ? (
          <Grid>
            <Grid.Col span={12}>
              <FilteredSortedSearchResults
                rows={searchableAdminList}
                columns={adminColumns}
                yOffset={280}
              />
            </Grid.Col>
          </Grid>
        ) : (
          <LoadingData />
        )}
      </Box>
    )
  );
}

export default AdminSearch;
