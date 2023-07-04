async function checkPermission(
  permission: Deno.PermissionDescriptor,
): Promise<boolean> {
  const status = await Deno.permissions.query(permission);

  if (status.state === "granted") {
    return true;
  } else {
    const reqStatus = await Deno.permissions.request(permission);

    return reqStatus.state === "granted";
  }
}

export async function checkPermissions(
  permissions: Deno.PermissionDescriptor[],
): Promise<boolean> {
  let allGranted = true;

  for (const permission of permissions) {
    const granted = await checkPermission(permission);

    if (!granted) {
      allGranted = false;

      break;
    }
  }

  return allGranted;
}
