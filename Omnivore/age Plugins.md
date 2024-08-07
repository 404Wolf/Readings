---
id: 5831af82-715f-4713-8e28-05a95a528585
title: age Plugins
tags:
  - RSS
date_published: 2024-07-17 11:03:26
---

# age Plugins
#Omnivore

[Read on Omnivore](https://omnivore.app/me/age-plugins-190c2491e38)
[Read Original](https://words.filippo.io/dispatches/age-plugins/)



[age](https:&#x2F;&#x2F;age-encryption.org&#x2F;?ref&#x3D;words.filippo.io) is a file encryption tool, library, and format. It lets you encrypt files to “recipients” and decrypt them with “identities”.

&#x60;&#x60;&#x60;fortran
$ age-keygen -o key.txt
Public key: age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p
$ tar cvz ~&#x2F;data | age -r age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p &gt; data.tar.gz.age
$ age --decrypt -i key.txt data.tar.gz.age &gt; data.tar.gz

&#x60;&#x60;&#x60;

You can encrypt a file to multiple recipients and decrypt it with any of the corresponding identities. There are built-in recipients for public keys and for password encryption, but age supports third-party recipient types at the format, library, and tool levels. These recipient implementations can offer alternative algorithms, support for specific hardware, or even make use of remote APIs such as cloud KMS.

That’s the one “[joint](https:&#x2F;&#x2F;www.imperialviolet.org&#x2F;2016&#x2F;05&#x2F;16&#x2F;agility.html?ref&#x3D;words.filippo.io)” in age, which otherwise aims for having no configurability.

At the format level, an age file starts with a header that includes “stanzas” each encrypting the file key to different recipients. The [specification](https:&#x2F;&#x2F;c2sp.org&#x2F;age?ref&#x3D;words.filippo.io) requires ignoring unrecognized stanzas, so third-party ones can coexist with native ones.[\[1\]](#fn1)

Here’s for example the header of a file encrypted to both a native public key recipient, and to a YubiKey. Note the two stanzas, introduced by &#x60;-&gt;&#x60;.

&#x60;&#x60;&#x60;smali
age-encryption.org&#x2F;v1
-&gt; piv-p256 OIF48w A7onGmpObHNfTCVLkq0QA4r4GJmzQLc6aVMAZVhrdbKb
SZwqyoXyHDOkoIJqYvxbo2p6j6tLVHMurkLivzYFDm0
-&gt; X25519 z2pytFfcbnyl&#x2F;ARKy1VA1W7P41Otn4ei7dNnWkf&#x2F;iWw
X4R193LCCdtkueqwJCSPRe&#x2F;HifrrxfbO3Zu8E+OyDp8
--- iZ5zBQBDL2SzxIAM9iArGViXViYF4lqrvAh4WMLozUY

&#x60;&#x60;&#x60;

At the library level, there are two fundamental interfaces that provide this abstraction: &#x60;Recipient&#x60; and &#x60;Interface&#x60;.

&#x60;&#x60;&#x60;reasonml
&#x2F;&#x2F; A Recipient is passed to Encrypt to wrap an opaque file key to one or more
&#x2F;&#x2F; recipient stanza(s). It can be for example a public key like X25519Recipient,
&#x2F;&#x2F; a plugin, or a custom implementation.
type Recipient interface {
	Wrap(fileKey []byte) ([]*Stanza, error)
}

&#x2F;&#x2F; Encrypt encrypts a file to one or more recipients.
func Encrypt(dst io.Writer, recipients ...Recipient) (io.WriteCloser, error)

&#x2F;&#x2F; An Identity is passed to Decrypt to unwrap an opaque file key from a
&#x2F;&#x2F; recipient stanza. It can be for example a secret key like X25519Identity, a
&#x2F;&#x2F; plugin, or a custom implementation.
&#x2F;&#x2F;
&#x2F;&#x2F; Unwrap must return an error wrapping ErrIncorrectIdentity if none of the
&#x2F;&#x2F; recipient stanzas match the identity, any other error will be considered
&#x2F;&#x2F; fatal.
type Identity interface {
	Unwrap(stanzas []*Stanza) (fileKey []byte, err error)
}

&#x2F;&#x2F; Decrypt decrypts a file with one or more identities.
func Decrypt(src io.Reader, identities ...Identity) (io.Reader, error)

&#x60;&#x60;&#x60;

Any Go package can provide a type that implements a &#x60;Wrap&#x60; or &#x60;Unwrap&#x60; method, and pass it to &#x60;age.Encrypt&#x60; or &#x60;age.Decrypt&#x60; respectively.

That allows Go applications to use third-party recipients with the Go age library, but age is also a command-line tool. At the tool level, the [age plugin system](https:&#x2F;&#x2F;c2sp.org&#x2F;age-plugin?ref&#x3D;words.filippo.io) exposes the Recipient and Identity interfaces over a language-agnostic stdin&#x2F;stdout protocol.

Plugins are selected based on the name of the recipient or identity encoding. For example if you use &#x60;-r age1&#x60; **&#x60;yubikey&#x60;**&#x60;1qwt50d05nh5vutpdzmlg5wn80xq5negm4uj9ghv0snvdd3yysf5yw3rhl3t&#x60; the age CLI will invoke &#x60;age-plugin-yubikey&#x60; from &#x60;$PATH&#x60; to wrap the file key.[\[2\]](#fn2) This means they can be mixed and matched with other plugins and native recipients.

Here’s an example transcript of decrypting the file from earlier with the YubiKey plugin, complete of the plugin asking the CLI to prompt the user for the PIN and of “grease” making sure the protocol doesn’t ossify. Note that [age-plugin-yubikey](https:&#x2F;&#x2F;github.com&#x2F;str4d&#x2F;age-plugin-yubikey?ref&#x3D;words.filippo.io) is developed by [str4d](https:&#x2F;&#x2F;github.com&#x2F;str4d?ref&#x3D;words.filippo.io) in Rust, while the age CLI is developed by me in Go.

&#x60;&#x60;&#x60;yaml
$ AGEDEBUG&#x3D;plugin age -d -i age-yubikey-identity-388178f3.txt &lt; test.age
send: -&gt; add-identity AGE-PLUGIN-YUBIKEY-1XQJ0QQY48ZQH3UC845XQL
send: 
send: -&gt; recipient-stanza 0 piv-p256 OIF48w A7onGmpObHNfTCVLkq0QA4r4GJmzQLc6aVMAZVhrdbKb
send: SZwqyoXyHDOkoIJqYvxbo2p6j6tLVHMurkLivzYFDm0
send: -&gt; recipient-stanza 0 X25519 z2pytFfcbnyl&#x2F;ARKy1VA1W7P41Otn4ei7dNnWkf&#x2F;iWw
send: X4R193LCCdtkueqwJCSPRe&#x2F;HifrrxfbO3Zu8E+OyDp8
send: -&gt; done
send: 
recv: -&gt; A:zw-grease &#x2F;S?j#y$ geD 3P. .|
recv: daN05YWjoDuf83JNSWc4mN&#x2F;qb1suAEYWXF6VsQA1qzCixeOk8s1Uv0Bh+dqHMYM
send: -&gt; unsupported
send: 
recv: -&gt; request-secret
recv: RW50ZXIgUElOIGZvciBZdWJpS2V5IHdpdGggc2VyaWFsIDE1NzM3OTA0
send: -&gt; ok
send: [REDACTED]
recv: -&gt; file-key 0
recv: GHzIb&#x2F;dwF93v8SwMuxVdPQ
send: -&gt; ok
send: 
recv: -&gt; qBZE~*,s-grease
recv: OLL8DDYeq6NvadvOLjy&#x2F;GRljAFuKpBkyT3vLd1OJ+4ve02Fi
send: -&gt; unsupported
send: 
recv: -&gt; done
recv: 
Frood!

&#x60;&#x60;&#x60;

The protocol only covers encryption and decryption. Plugins are expected to handle key generation in whatever way suits them best, usually by having users invoke the plugin binary directly.

The plugin architecture is now a few years old, and there are [some amazing plugins](https:&#x2F;&#x2F;github.com&#x2F;FiloSottile&#x2F;awesome-age?tab&#x3D;readme-ov-file&amp;ref&#x3D;words.filippo.io#plugins) out there, including stable [YubiKey](https:&#x2F;&#x2F;github.com&#x2F;str4d&#x2F;age-plugin-yubikey?ref&#x3D;words.filippo.io) and [Apple Secure Enclave](https:&#x2F;&#x2F;github.com&#x2F;remko&#x2F;age-plugin-se?ref&#x3D;words.filippo.io) ones, and experimental [TPM 2.0](https:&#x2F;&#x2F;github.com&#x2F;Foxboron&#x2F;age-plugin-tpm?ref&#x3D;words.filippo.io), [symmetric FIDO2](https:&#x2F;&#x2F;github.com&#x2F;olastor&#x2F;age-plugin-fido2-hmac?ref&#x3D;words.filippo.io), and even [Shamir&#39;s Secret Sharing](https:&#x2F;&#x2F;github.com&#x2F;olastor&#x2F;age-plugin-sss?ref&#x3D;words.filippo.io) ones.

If a Go program wishes to use a plugin with the age library, we provide [Recipient](https:&#x2F;&#x2F;pkg.go.dev&#x2F;filippo.io&#x2F;age&#x2F;plugin?ref&#x3D;words.filippo.io#Recipient) and [Identity](https:&#x2F;&#x2F;pkg.go.dev&#x2F;filippo.io&#x2F;age&#x2F;plugin?ref&#x3D;words.filippo.io#Identity) implementations that automatically execute plugins to implement Wrap and Unwrap. Thanks to the careful mapping of the interface and plugin abstractions, the two are effectively interchangeable.

To complete the picture, last month Yolan Romailler and I designed an experimental Go framework to do the opposite: turn Recipient and Identity implementations into plugins, abstracting away the plugin protocol.

Assuming a library already implements &#x60;NewRecipient&#x60; and &#x60;NewIdentity&#x60; functions, building a plugin boils down to just a few lines in a &#x60;main()&#x60; function.

&#x60;&#x60;&#x60;go
func main() {
	p, err :&#x3D; plugin.New(&quot;example&quot;)
	if err !&#x3D; nil {
		log.Fatal(err)
	}
	p.HandleRecipient(func(data []byte) (age.Recipient, error) {
		return NewRecipient(data)
	})
	p.HandleIdentity(func(data []byte) (age.Identity, error) {
		return NewIdentity(data)
	})
	os.Exit(p.Main())
}

&#x60;&#x60;&#x60;

The framework lets applications define their own CLI flags, for example for key generation, and supports the interactive features of the protocol such as displaying message or prompting the user.

It’s ready to try by &#x60;go get&#x60;\-ing &#x60;filippo.io&#x2F;age@filippo&#x2F;plugin&#x60;, and was already [adopted by age-plugin-tpm](https:&#x2F;&#x2F;github.com&#x2F;Foxboron&#x2F;age-plugin-tpm&#x2F;pull&#x2F;24?ref&#x3D;words.filippo.io). [Docs are on pkg.go.dev.](https:&#x2F;&#x2F;pkg.go.dev&#x2F;filippo.io&#x2F;age@v1.2.1-0.20240618131852-7eedd929a6cf&#x2F;plugin?ref&#x3D;words.filippo.io#Plugin) Provide feedback in the [pull request](https:&#x2F;&#x2F;github.com&#x2F;FiloSottile&#x2F;age&#x2F;pull&#x2F;580?ref&#x3D;words.filippo.io).

The Rust ecosystem already has its equivalents in the [age::plugin](https:&#x2F;&#x2F;docs.rs&#x2F;age&#x2F;0.10.0&#x2F;age&#x2F;plugin&#x2F;index.html?ref&#x3D;words.filippo.io) module and [age-plugin crate](https:&#x2F;&#x2F;crates.io&#x2F;crates&#x2F;age-plugin?ref&#x3D;words.filippo.io).

In related news, the [recent v1.2.0 release of age](https:&#x2F;&#x2F;github.com&#x2F;FiloSottile&#x2F;age&#x2F;releases&#x2F;tag&#x2F;v1.2.0?ref&#x3D;words.filippo.io) introduced an extension to the Recipient interface—[RecipientWithLabels](https:&#x2F;&#x2F;pkg.go.dev&#x2F;filippo.io&#x2F;age?ref&#x3D;words.filippo.io#RecipientWithLabels)—which lets the recipient communicate to the age implementation its preferences on being mixed with other recipients, as a set of labels. For example, a recipient that returns &#x60;[postquantum]&#x60; could only be mixed with other [post-quantum](https:&#x2F;&#x2F;words.filippo.io&#x2F;dispatches&#x2F;post-quantum-age&#x2F;) recipients, to avoid downgrade attacks, and a recipient that returns a random string could not be mixed with any others, allowing it to uphold its users’ expectations of [authentication](https:&#x2F;&#x2F;words.filippo.io&#x2F;dispatches&#x2F;age-authentication&#x2F;). This is exciting because it removes the last special case for native recipients in age, which was ensuring _scrypt_ recipients could only be used alone. This extension is already supported in the Go plugin client and framework implementations, and we have a [pull request](https:&#x2F;&#x2F;github.com&#x2F;C2SP&#x2F;C2SP&#x2F;pull&#x2F;37?ref&#x3D;words.filippo.io) to add it to the spec.

Open more thing! Speaking of plugins and specs, many hardware plugins had to redefine their own version of P-256 recipients with a tag (to avoid asking for useless PINs). We’re [talking about](https:&#x2F;&#x2F;github.com&#x2F;C2SP&#x2F;C2SP&#x2F;pull&#x2F;31?ref&#x3D;words.filippo.io#issuecomment-2183194401) defining a standard one, and supporting it on the recipient side natively in age, so that users can encrypt to various hardware-based recipients without installing the plugin.

If you got this far, you might also want to follow me on Bluesky at [@filippo.abyssdomain.expert](https:&#x2F;&#x2F;bsky.app&#x2F;profile&#x2F;filippo.abyssdomain.expert?ref&#x3D;words.filippo.io) or on Mastodon at [@filippo@abyssdomain.expert](https:&#x2F;&#x2F;abyssdomain.expert&#x2F;@filippo?ref&#x3D;words.filippo.io).

## The picture

Took a friend on her first scuba dive last year, and went looking for scorpionfishes in the shallow water. Ugly little fella. (This year marks the 20th anniversary of my first dive. I’m a bit unsettled by the idea that I’ve been doing this, or anything really, for two decades.)

![A small, colorful fish with mottled brown and white coloration and spiny dorsal fins. The fish is resting on the sandy bottom near some rocky, algae-covered structures.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s8AqkFHSpsNkGk8k4f2a0MuPj_F1WSYTyG_5Is-bUaOs&#x2F;https:&#x2F;&#x2F;words.filippo.io&#x2F;content&#x2F;images&#x2F;2024&#x2F;06&#x2F;IMG_1386--1-.jpeg)

All this work is funded by the awesome [Geomys](https:&#x2F;&#x2F;geomys.org&#x2F;?ref&#x3D;words.filippo.io) clients: [Latacora](https:&#x2F;&#x2F;www.latacora.com&#x2F;?ref&#x3D;words.filippo.io), [Interchain](https:&#x2F;&#x2F;interchain.io&#x2F;?ref&#x3D;words.filippo.io), [Smallstep](https:&#x2F;&#x2F;smallstep.com&#x2F;?ref&#x3D;words.filippo.io), [Ava Labs](https:&#x2F;&#x2F;www.avalabs.org&#x2F;?ref&#x3D;words.filippo.io), [Teleport](https:&#x2F;&#x2F;goteleport.com&#x2F;?ref&#x3D;words.filippo.io), [SandboxAQ](https:&#x2F;&#x2F;www.sandboxaq.com&#x2F;?ref&#x3D;words.filippo.io), [Charm](https:&#x2F;&#x2F;charm.sh&#x2F;?ref&#x3D;words.filippo.io), and [Tailscale](https:&#x2F;&#x2F;tailscale.com&#x2F;?ref&#x3D;words.filippo.io). Through our retainer contracts they ensure the sustainability and reliability of our open source maintenance work and get a direct line to my expertise and that of the other Geomys maintainers. (Learn more in the [Geomys announcement](https:&#x2F;&#x2F;words.filippo.io&#x2F;geomys).)

Here are a few words from some of them!

Latacora — [Latacora](https:&#x2F;&#x2F;www.latacora.com&#x2F;?ref&#x3D;words.filippo.io) bootstraps security practices for startups. Instead of wasting your time trying to hire a security person who is good at everything from Android security to AWS IAM strategies to SOC2 and apparently has the time to answer all your security questionnaires plus never gets sick or takes a day off, you hire us. We provide a crack team of professionals prepped with processes and power tools, coupling individual security capabilities with strategic program management and tactical project management.

Teleport — For the past five years, attacks and compromises have been shifting from traditional malware and security breaches to identifying and compromising valid user accounts and credentials with social engineering, credential theft, or phishing. [Teleport Identity Governance &amp; Security](https:&#x2F;&#x2F;goteleport.com&#x2F;identity-governance-security&#x2F;?utm&#x3D;filippo&amp;ref&#x3D;words.filippo.io) is designed to eliminate weak access patterns through access monitoring, minimize attack surface with access requests, and purge unused permissions via mandatory access reviews.

Ava Labs — We at [Ava Labs](https:&#x2F;&#x2F;www.avalabs.org&#x2F;?ref&#x3D;words.filippo.io), maintainer of [AvalancheGo](https:&#x2F;&#x2F;github.com&#x2F;ava-labs&#x2F;avalanchego?ref&#x3D;words.filippo.io) (the most widely used client for interacting with the [Avalanche Network](https:&#x2F;&#x2F;www.avax.network&#x2F;?ref&#x3D;words.filippo.io)), believe the sustainable maintenance and development of open source cryptographic protocols is critical to the broad adoption of blockchain technology. We are proud to support this necessary and impactful work through our ongoing sponsorship of Filippo and his team.

SandboxAQ — [SandboxAQ](https:&#x2F;&#x2F;www.sandboxaq.com&#x2F;?ref&#x3D;words.filippo.io)’s [AQtive Guard](https:&#x2F;&#x2F;www.sandboxaq.com&#x2F;solutions&#x2F;aqtive-guard?ref&#x3D;words.filippo.io) is a unified cryptographic management software platform that helps protect sensitive data and ensures compliance with authorities and customers. It provides a full range of capabilities to achieve cryptographic agility, acting as an essential cryptography inventory and data aggregation platform that applies current and future standardization organizations mandates. AQtive Guard automatically analyzes and reports on your cryptographic security posture and policy management, enabling your team to deploy and enforce new protocols, including quantum-resistant cryptography, without re-writing code or modifying your IT infrastructure.

---

1. Actually, stanzas are not strongly tied to the recipient type, so third-party recipients can produce native stanzas and third-party identities can decrypt them. This is useful for example if you want to store a native age key in a KMS system: you can use native recipients to encrypt to it, and a custom identity to decrypt them. This took us a few months to figure out as the right abstraction, and you can see a bit of vestiges of the previous design in the API. [↩︎](#fnref1)
2. This also took some time to come up with. It feels obvious in retrospect, especially now that recipient types and header stanzas are not tightly coupled, but back then we spent a lot of time thinking with [str4d](https:&#x2F;&#x2F;github.com&#x2F;str4d?ref&#x3D;words.filippo.io) about how to enable plugins in such a way that it wouldn’t give potentially untrusted files control over what plugins are executed. Having the recipient and identity encodings select the plugins has both good UX and good security, and they can produce&#x2F;consume any stanzas, allowing “proxy” plugins and reuse of the native types. [↩︎](#fnref2)