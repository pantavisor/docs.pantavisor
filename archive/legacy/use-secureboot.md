# Secure your Revision

This page shows how to make Pantavisor check the integrity of your revision using the [secureboot feature](storage.md#integrity).

:::note
Bear in mind that secureboot is set to _lenient_ by default in the [configuration](pantavisor-configuration.md#summary). This means that only the signed artifacts will be verified by Pantavisor but if we wanted it to check that all artifacts in the revision were signed, we would need to set it to _strict_.
:::

## Sign with Pantavisor Keys

First let's start by using Pantavisor Keys. This is convinient for testing purposes only, as private keys are publicly available and thus everyone can sign the artifacts.

By default, `pvr` with work with Pantavisor Keys. To inspect the signature state of a checkout:

```
cd my-checkout
pvr sig ls
```

This will return something similar than to this:

```
{
    "protected": [
        "#spec",
        "_hostconfig/pvr/docker.json",
        "awconnect/lxc.container.conf",
        "awconnect/root.squashfs",
        "awconnect/root.squashfs.docker-digest",
        "awconnect/run.json",
        "bsp/drivers.json",
        "bsp/firmware.squashfs",
        "bsp/kernel.img",
        "bsp/modules.squashfs",
        "bsp/pantavisor",
        "bsp/run.json",
        "bsp/trail.config",
        "device.json"
    ],
    "excluded": [
        "_sigs/awconnect.json",
        "_sigs/bsp.json",
        "awconnect/src.json",
        "bsp/build.json",
        "bsp/src.json"
    ],
    "notseen": [
        "pv-avahi/lxc.container.conf",
        "pv-avahi/root.squashfs",
        "pv-avahi/root.squashfs.docker-digest",
        "pv-avahi/run.json",
        "pv-avahi/src.json"
    ]
}
```

Under the `protected` lists, you will see the checkout elements that are signed, in `excluded` those that are acknowledged but not signed and, in `notseen` all that are not acknowledged. It is important to notice that the `notseen` list must be empty if we want to post updates when the device is in `strict` [secureboot mode](storage.md#state-signature).

To sign the pv-avahi container:

```
pvr sig add --raw pv-avahi --include 'pv-avahi/**' --exclude _sigs/pv-avahi.json --exclude pv-avahi/src.json
pvr add .
pvr commit
pvr post
```

This will completely sign the rest of the checkout. You can also inspect each signature to see how it is formed:

```
cat _sigs/pv-avahi.json  | jq -r .protected | base64 -d | jq
```

In the case of the newly signed signature:

```
{
  "alg": "RS256",
  "jwk": {
    "kty": "RSA",
    "n": "v4IkL530XFY2OUxhoo9eQifuNlQFOf8lGnZ0RUFJoZNDQ5iGEiqyxM0Ki9XyQJUWX6DzWcyRUVORIIKoaE-rfPwaHuBgNT4WcdsF3z54lXd9MClug_z9ylH-TSKPaJjoNFP2MWC_Jyuu1lnnqnb5GsRT5XXuFP813pT9g_n_FaVl3nzwLRt9fhG8k7cS92RrGf4GZjBv3PKNFrV8poNfuh29Xrmq0Vsy-TjO5JaOd6o5EqxFepJNs-Kmf1GLf9_a-k7B7aD2AgJc-aJOFgeDV3mPPDIq_nkOxomap4kveGDcnLLp86OUdPBZ-ecdyxfhQOzern8sj8845nhfZZOFCw",
    "e": "AQAB"
  },
  "pvs": {
    "include": [
      "pv-avahi/**",
      "_config/pv-avahi/**"
    ],
    "exclude": [
      "pv-avahi/src.json",
      "_sigs/pv-avahi.json"
    ]
  },
  "typ": "PVS",
  "x5c": [
    "MIIDajCCAlKgAwIBAgIRAKBshe/AwP9db6uOSILSu8IwDQYJKoZIhvcNAQELBQAwHDEaMBgGA1UEAwwRUGFudGF2aXNvciBEZXYgQ0EwHhcNMjIwNjEyMTAwMDE4WhcNMjQwOTE0MTAwMDE4WjAaMRgwFgYDVQQDDA9wdi1kZXZlbG9wZXItMDEwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC/giQvnfRcVjY5TGGij15CJ+42VAU5/yUadnRFQUmhk0NDmIYSKrLEzQqL1fJAlRZfoPNZzJFRU5EggqhoT6t8/Boe4GA1PhZx2wXfPniVd30wKW6D/P3KUf5NIo9omOg0U/YxYL8nK67WWeeqdvkaxFPlde4U/zXelP2D+f8VpWXefPAtG31+EbyTtxL3ZGsZ/gZmMG/c8o0WtXymg1+6Hb1euarRWzL5OM7klo53qjkSrEV6kk2z4qZ/UYt/39r6TsHtoPYCAlz5ok4WB4NXeY88Mir+eQ7GiZqniS94YNycsunzo5R08Fn55x3LF+FA7N6ufyyPzzjmeF9lk4ULAgMBAAGjgagwgaUwCQYDVR0TBAIwADAdBgNVHQ4EFgQU1e3xZhHRBJz2JJJyR16f2LG22GMwVwYDVR0jBFAwToAUWYuQ+pKC4IbpmCmvE/j4IeqRgT2hIKQeMBwxGjAYBgNVBAMMEVBhbnRhdmlzb3IgRGV2IENBghRjcQZ0eiqqtBk80eBjIASTScWJyjATBgNVHSUEDDAKBggrBgEFBQcDAzALBgNVHQ8EBAMCB4AwDQYJKoZIhvcNAQELBQADggEBABW0UCzH5m7kq4Q4b/jzQK3NPy9PF8p9lh8Ks5dvHIAQbLmMKyFbXQirnXqeeeHX9+MTE6L7mJUZ6EZobe1jiJ6TG3prq83WrQHEhBPWY95aldPAnXBxHOKz9o/qa3+eUYXuhMZ+PPbYdcmZoe82A77JVsG1JFceiDlXVzb8/+jumgx0U3sXW7aAr1ZWaM4VjZLtlfwBOJ/QCM8ltRaR2Oz7mTjfU53ZX3Q8sVATGeUEhGlSzHHTB4/oMgFvwahOifSy2nRME/Ay/CjL3/H21E0GDp/iBoAgPo7/AhMdE9iF2WgtcAwEUEpvjvWI4Yk7Ybm33PItThl7CCNco4uNO9o="
  ]
}
```

When consuming the new update, Pantavisor will validate that the `_sigs/pv-avahi.json` file. If that fails in [_lenient_ or _strict_ mode](storage.md#state-signature), the new revision be [aborted](updates.md#wontgo) before being isntalled.

## Sign with your Own Keys

To get your keys into a Pantavisor device, you will have to [build your own Pantavisor BSP](environment-setup.md). You can check how keys are included in the project, taking our [Pantavisor Keys repo](https://gitlab.com/pantacor/pv-developer-ca) as an example. This repo will be download to your host machine when [syncing the BSP source code](get-source-code.md) so you can fork that repo and continue from there.

Once that is done, you will have to tell `pvr` how to get the private keys for signing your revision. To do that, you can use these environment variables:

```
PVR_SIG_KEY=path/key.default.pem
PVR_X5C_PATH=path/x5c.default.pem
PVR_SIG_CACERTS=path/cacerts.default.pem

export PVR_SIG_KEY PVR_X5C_PATH PVR_SIG_CACERTS

chmod 600 $PVR_SIG_KEY
chmod 644 $PVR_X5C_PATH
chmod 644 $PVR_SIG_CACERTS
```

Now, you can follow the [previous section how-to](#sign-with-pantavisor-keys) and `pvr sig` will use your own keys.
