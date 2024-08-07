---
id: 3a899a25-1642-43fe-9e03-e91dbc230596
---

# Syncthing Protocol
#Omnivore

[Read on Omnivore](https://omnivore.app/me/block-exchange-protocol-v-1-syncthing-documentation-189f6a0109d)
[Read Original](https://docs.syncthing.net/specs/bep-v1.html)


Browsing documentation for version: 

## Introduction and Definitions[¶](#introduction-and-definitions &quot;Permalink to this headline&quot;)

The Block Exchange Protocol (BEP) is used between two or more _devices_ thus forming a _cluster_. Each device has one or more _folders_ of files described by the _local model_, containing metadata and block hashes. The local model is sent to the other devices in the cluster. The union of all files in the local models, with files selected for highest change version, forms the _global model_. Each device strives to get its folders in sync with the global model by requesting missing or outdated blocks from the other devices in the cluster.

File data is described and transferred in units of _blocks_, each being from 128 KiB (131072 bytes) to 16 MiB in size, in steps of powers of two. The block size may vary between files but is constant in any given file, except for the last block which may be smaller.

The key words “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “MAY”, and “OPTIONAL” in this document are to be interpreted as described in [**RFC 2119**](https:&#x2F;&#x2F;datatracker.ietf.org&#x2F;doc&#x2F;html&#x2F;rfc2119.html).

## Transport and Authentication[¶](#transport-and-authentication &quot;Permalink to this headline&quot;)

BEP is deployed as the highest level in a protocol stack, with the lower level protocols providing encryption and authentication.

+-----------------------------+
|   Block Exchange Protocol   |
|-----------------------------|
| Encryption &amp; Auth (TLS 1.2) |
|-----------------------------|
|      Reliable Transport     |
|-----------------------------|
v             ...             v

The encryption and authentication layer SHALL use TLS 1.2 or a higher revision. A strong cipher suite SHALL be used, with “strong cipher suite” being defined as being without known weaknesses and providing Perfect Forward Secrecy (PFS). Examples of strong cipher suites are given at the end of this document. This is not to be taken as an exhaustive list of allowed cipher suites but represents best practices at the time of writing.

The exact nature of the authentication is up to the application, however it SHALL be based on the TLS certificate presented at the start of the connection. Possibilities include certificates signed by a common trusted CA, preshared certificates, preshared certificate fingerprints or certificate pinning combined with some out of band first verification. The reference implementation uses preshared certificate fingerprints (SHA-256) referred to as “Device IDs”.

There is no required order or synchronization among BEP messages except as noted per message type - any message type may be sent at any time and the sender need not await a response to one message before sending another.

The underlying transport protocol MUST guarantee reliable packet delivery.

In this document, in diagrams and text, “bit 0” refers to the _most significant_ bit of a word; “bit 15” is thus the least significant bit of a 16 bit word (int16) and “bit 31” is the least significant bit of a 32 bit word (int32). Non protocol buffer integers are always represented in network byte order (i.e., big endian) and are signed unless stated otherwise, but when describing message lengths negative values do not make sense and the most significant bit MUST be zero.

The protocol buffer schemas in this document are in &#x60;proto3&#x60; syntax. This means, among other things, that all fields are optional and will assume their default value when missing. This does not necessarily mean that a message is _valid_ with all fields empty - for example, an index entry for a file that does not have a name is not useful and MAY be rejected by the implementation. However the folder label is for human consumption only so an empty label should be accepted - the implementation will have to choose some way to represent the folder, perhaps by using the ID in it’s place or automatically generating a label.

## Pre-authentication messages[¶](#pre-authentication-messages &quot;Permalink to this headline&quot;)

AFTER establishing a connection, but BEFORE performing any authentication, devices MUST exchange Hello messages.

Hello messages are used to carry additional information about the peer, which might be of interest to the user even if the peer is not permitted to communicate due to failing authentication. Note that the certificate based authentication may be considered part of the TLS handshake that precedes the Hello message exchange, but even in the case that a connection is rejected a Hello message must be sent before the connection is terminated.

Hello messages MUST be prefixed with an int32 containing the magic number**0x2EA7D90B**, followed by an int16 representing the size of the message, followed by the contents of the Hello message itself.

 0                   1
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|             Magic             |
|           (32 bits)           |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|             Length            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
&#x2F;                               &#x2F;
\             Hello             \
&#x2F;                               &#x2F;
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

The Hello message itself is in protocol buffer format with the following schema:

message Hello {
    string device_name    &#x3D; 1;
    string client_name    &#x3D; 2;
    string client_version &#x3D; 3;
}

### Fields (Hello message)[¶](#fields-hello-message &quot;Permalink to this headline&quot;)

The **device\_name** is a human readable (configured or auto detected) device name or host name, for the remote device.

The **client\_name** and **client\_version** identifies the implementation. The values SHOULD be simple strings identifying the implementation name, as a user would expect to see it, and the version string in the same manner. An example client name is “syncthing” and an example client version is “v0.7.2”. The client version field SHOULD follow the patterns laid out in the [Semantic Versioning](https:&#x2F;&#x2F;semver.org&#x2F;) standard.

Immediately after exchanging Hello messages, the connection MUST be dropped if the remote device does not pass authentication.

## Post-authentication Messages[¶](#post-authentication-messages &quot;Permalink to this headline&quot;)

Every message post authentication is made up of several parts:

* A header length word
* A **Header**
* A message length word
* A **Message**

 0                   1
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|         Header Length         |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
&#x2F;                               &#x2F;
\            Header             \
&#x2F;                               &#x2F;
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|         Message Length        |
|           (32 bits)           |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
&#x2F;                               &#x2F;
\            Message            \
&#x2F;                               &#x2F;
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

The header length word is 16 bits. It indicates the length of the following**Header** message. The Header is in protocol buffer format. The Header describes the type and compression status of the following message.

The message is preceded by the 32 bit message length word and is one of the concrete BEP messages described below, identified by the **type** field of the Header.

As always, the length words are in network byte order (big endian).

message Header {
    MessageType        type        &#x3D; 1;
    MessageCompression compression &#x3D; 2;
}

enum MessageType {
    CLUSTER_CONFIG    &#x3D; 0;
    INDEX             &#x3D; 1;
    INDEX_UPDATE      &#x3D; 2;
    REQUEST           &#x3D; 3;
    RESPONSE          &#x3D; 4;
    DOWNLOAD_PROGRESS &#x3D; 5;
    PING              &#x3D; 6;
    CLOSE             &#x3D; 7;
}

enum MessageCompression {
    NONE &#x3D; 0;
    LZ4  &#x3D; 1;
}

When the **compression** field is **NONE**, the message is directly in protocol buffer format.

When the compression field is **LZ4**, the message consists of a 32 bit integer describing the uncompressed message length followed by a single LZ4 block. After decompressing the LZ4 block it should be interpreted as a protocol buffer message just as in the uncompressed case.

## Message Subtypes[¶](#message-subtypes &quot;Permalink to this headline&quot;)

### Cluster Config[¶](#cluster-config &quot;Permalink to this headline&quot;)

This informational message provides information about the cluster configuration as it pertains to the current connection. A Cluster Config message MUST be the first post authentication message sent on a BEP connection. Additional Cluster Config messages MUST NOT be sent after the initial exchange.

#### Protocol Buffer Schema[¶](#protocol-buffer-schema &quot;Permalink to this headline&quot;)

message ClusterConfig {
    repeated Folder folders &#x3D; 1;
}

message Folder {
    string id                   &#x3D; 1;
    string label                &#x3D; 2;
    bool   read_only            &#x3D; 3;
    bool   ignore_permissions   &#x3D; 4;
    bool   ignore_delete        &#x3D; 5;
    bool   disable_temp_indexes &#x3D; 6;
    bool   paused               &#x3D; 7;

    repeated Device devices &#x3D; 16;
}

message Device {
    bytes           id                         &#x3D; 1;
    string          name                       &#x3D; 2;
    repeated string addresses                  &#x3D; 3;
    Compression     compression                &#x3D; 4;
    string          cert_name                  &#x3D; 5;
    int64           max_sequence               &#x3D; 6;
    bool            introducer                 &#x3D; 7;
    uint64          index_id                   &#x3D; 8;
    bool            skip_introduction_removals &#x3D; 9;
    bytes           encryption_password_token  &#x3D; 10;
}

enum Compression {
    METADATA &#x3D; 0;
    NEVER    &#x3D; 1;
    ALWAYS   &#x3D; 2;
}

#### Fields (Cluster Config Message)[¶](#fields-cluster-config-message &quot;Permalink to this headline&quot;)

The **folders** field contains the list of folders that will be synchronized over the current connection.

#### Fields (Folder Message)[¶](#fields-folder-message &quot;Permalink to this headline&quot;)

The **id** field contains the folder ID, which is the unique identifier of the folder.

The **label** field contains the folder label, the human readable name of the folder.

The **read\_only** field is set for folders that the device will accept no updates from the network for.

The **ignore\_permissions** field is set for folders that the device will not accept or announce file permissions for.

The **ignore\_delete** field is set for folders that the device will ignore deletes for.

The **disable\_temp\_indexes** field is set for folders that will not dispatch and do not wish to receive progress updates about partially downloaded files via Download Progress messages.

The **paused** field is set for folders that are currently paused.

The **devices** field is a list of devices participating in sharing this folder.

#### Fields (Device Message)[¶](#fields-device-message &quot;Permalink to this headline&quot;)

The device **id** field is a 32 byte number that uniquely identifies the device. For instance, the reference implementation uses the SHA-256 of the device X.509 certificate.

The **name** field is a human readable name assigned to the described device by the sending device. It MAY be empty and it need not be unique.

The list of **addresses** is that used by the sending device to connect to the described device.

The **compression** field indicates the compression mode in use for this device and folder. The following values are valid:

0

Compress metadata. This enables compression of metadata messages such as Index.

1

Compression disabled. No compression is used on any message.

2

Compress always. Metadata messages as well as Response messages are compressed.

The **cert\_name** field indicates the expected certificate name for this device. It is commonly blank, indicating to use the implementation default.

The **max\_sequence** field contains the highest sequence number of the files in the index. See [Delta Index Exchange](#deltaidx) for the usage of this field.

The **introducer** field is set for devices that are trusted as cluster introducers.

The **index\_id** field contains the unique identifier for the current set of index data. See [Delta Index Exchange](#deltaidx) for the usage of this field.

The **skip\_introduction\_removals** field signifies if the remote device has opted to ignore introduction removals for the given device. This setting is copied across as we are being introduced to a new device.

The **encryption\_password\_token** field contains a token derived from the password, that is used to encrypt data sent to this device. If the device is the same as the device sending the message, it signifies that the device itself has encrypted data that was encrypted with the given token. It is empty or missing if there is no encryption. See [Untrusted Device Encryption](https:&#x2F;&#x2F;docs.syncthing.net&#x2F;specs&#x2F;untrusted#untrusted) for details on the encryption scheme.

### Index and Index Update[¶](#index-and-index-update &quot;Permalink to this headline&quot;)

The Index and Index Update messages define the contents of the senders folder. An Index message represents the full contents of the folder and thus supersedes any previous index. An Index Update amends an existing index with new information, not affecting any entries not included in the message. An Index Update MAY NOT be sent unless preceded by an Index, unless a non-zero Max Sequence has been announced for the given folder by the peer device.

The Index and Index Update messages are currently identical in format, although this is not guaranteed to be the case in the future.

#### Protocol Buffer Schema[¶](#id2 &quot;Permalink to this headline&quot;)

message Index {
    string            folder &#x3D; 1;
    repeated FileInfo files  &#x3D; 2;
}

message IndexUpdate {
    string            folder &#x3D; 1;
    repeated FileInfo files  &#x3D; 2;
}

message FileInfo {
    string       name           &#x3D; 1;
    FileInfoType type           &#x3D; 2;
    int64        size           &#x3D; 3;
    uint32       permissions    &#x3D; 4;
    int64        modified_s     &#x3D; 5;
    int32        modified_ns    &#x3D; 11;
    uint64       modified_by    &#x3D; 12;
    bool         deleted        &#x3D; 6;
    bool         invalid        &#x3D; 7;
    bool         no_permissions &#x3D; 8;
    Vector       version        &#x3D; 9;
    int64        sequence       &#x3D; 10;
    int32        block_size     &#x3D; 13;

    repeated BlockInfo Blocks         &#x3D; 16;
    string             symlink_target &#x3D; 17;
}

enum FileInfoType {
    FILE              &#x3D; 0;
    DIRECTORY         &#x3D; 1;
    SYMLINK_FILE      &#x3D; 2 [deprecated &#x3D; true];
    SYMLINK_DIRECTORY &#x3D; 3 [deprecated &#x3D; true];
    SYMLINK           &#x3D; 4;
}

message BlockInfo {
    int64 offset     &#x3D; 1;
    int32 size       &#x3D; 2;
    bytes hash       &#x3D; 3;
    uint32 weak_hash &#x3D; 4;
}

message Vector {
    repeated Counter counters &#x3D; 1;
}

message Counter {
    uint64 id    &#x3D; 1;
    uint64 value &#x3D; 2;
}

#### Fields (Index Message)[¶](#fields-index-message &quot;Permalink to this headline&quot;)

The **folder** field identifies the folder that the index message pertains to.

The **files** field is a list of files making up the index information.

#### Fields (FileInfo Message)[¶](#fields-fileinfo-message &quot;Permalink to this headline&quot;)

The **name** is the file name path relative to the folder root. Like all strings in BEP, the Name is always in UTF-8 NFC regardless of operating system or file system specific conventions. The name field uses the slash character (“&#x2F;”) as path separator, regardless of the implementation’s operating system conventions. The combination of folder and name uniquely identifies each file in a cluster.

The **type** field contains the type of the described item. The type is one of **file (0)**, **directory (1)**, or **symlink (4)**.

The **size** field contains the size of the file, in bytes. For directories and symlinks the size is zero.

The **permissions** field holds the common Unix permission bits. An implementation MAY ignore or interpret these as is suitable on the host operating system.

The **modified\_s** time is expressed as the number of seconds since the Unix Epoch (1970-01-01 00:00:00 UTC). The **modified\_ns** field holds the nanosecond part of the modification time.

The **modified\_by** field holds the short id of the client that last made any modification to the file whether add, change or delete. This will be overwritten every time a change is made to the file by the last client to do so and so does not hold history.

The **deleted** field is set when the file has been deleted. The block list SHALL be of length zero and the modification time indicates the time of deletion or, if the time of deletion is not reliably determinable, the last known modification time.

The **invalid** field is set when the file is invalid and unavailable for synchronization. A peer MAY set this bit to indicate that it can temporarily not serve data for the file.

The **no\_permissions** field is set when there is no permission information for the file. This is the case when it originates on a file system which does not support permissions. Changes to only permission bits SHOULD be disregarded on files with this bit set. The permissions bits MUST be set to the octal value 0666.

The **version** field is a version vector describing the updates performed to a file by all members in the cluster. Each counter in the version vector is an ID-Value tuple. The ID is the first 64 bits of the device ID. The Value is a simple incrementing counter, starting at zero. The combination of Folder, Name and Version uniquely identifies the contents of a file at a given point in time.

The **sequence** field is the value of a device local monotonic clock at the time of last local database update to a file. The clock ticks on every local database update, thus forming a sequence number over database updates.

The **block\_size** field is the size, in bytes, of each individual block in the block list (except, possibly, the last block). If this field is missing or zero, the block size is assumed to be 128 KiB (131072 bytes). Valid values of this field are the powers of two from 128 KiB through 16 MiB. See also [Selection of Block Size](#blocksize).

The **blocks** list contains the size and hash for each block in the file. Each block represents a **block\_size**\-sized slice of the file, except for the last block which may represent a smaller amount of data. The block list is empty for directories and symlinks.

The **symlink\_target** field contains the symlink target, for entries of symlink type. It is empty for all other entry types.

### Request[¶](#request &quot;Permalink to this headline&quot;)

The Request message expresses the desire to receive a data block corresponding to a part of a certain file in the peer’s folder.

#### Protocol Buffer Schema[¶](#id3 &quot;Permalink to this headline&quot;)

message Request {
    int32  id             &#x3D; 1;
    string folder         &#x3D; 2;
    string name           &#x3D; 3;
    int64  offset         &#x3D; 4;
    int32  size           &#x3D; 5;
    bytes  hash           &#x3D; 6;
    bool   from_temporary &#x3D; 7;
}

#### Fields[¶](#fields &quot;Permalink to this headline&quot;)

The **id** is the request identifier. It will be matched in the corresponding **Response** message. Each outstanding request must have a unique ID.

The **folder** and **name** fields are as documented for the Index message. The **offset** and **size** fields specify the region of the file to be transferred. This SHOULD equate to exactly one block as seen in an Index message.

The _hash_ field MAY be set to the expected hash value of the block. If set, the other device SHOULD ensure that the transmitted block matches the requested hash. The other device MAY reuse a block from a different file and offset having the same size and hash, if one exists.

The **from\_temporary** field is set to indicate that the read should be performed from the temporary file (converting name to it’s temporary form) and falling back to the non temporary file if any error occurs. Knowledge of contents of temporary files comes from DownloadProgress messages.

### Response[¶](#response &quot;Permalink to this headline&quot;)

The Response message is sent in response to a Request message.

#### Protocol Buffer Schema[¶](#id4 &quot;Permalink to this headline&quot;)

message Response {
    int32     id   &#x3D; 1;
    bytes     data &#x3D; 2;
    ErrorCode code &#x3D; 3;
}

enum ErrorCode {
    NO_ERROR     &#x3D; 0;
    GENERIC      &#x3D; 1;
    NO_SUCH_FILE &#x3D; 2;
    INVALID_FILE &#x3D; 3;
}

#### Fields[¶](#id5 &quot;Permalink to this headline&quot;)

The **id** field is the request identifier. It must match the ID of the**Request** that is being responded to.

The **data** field contains either the requested data block or is empty if the requested block is not available.

The **code** field contains an error code describing the reason a Request could not be fulfilled, in the case where zero length data was returned. The following values are defined:

0

No Error (data should be present)

1

Generic Error

2

No Such File (the requested file does not exist, or the offset is outside the acceptable range for the file)

3

Invalid (file exists but has invalid bit set or is otherwise unavailable)

### DownloadProgress[¶](#downloadprogress &quot;Permalink to this headline&quot;)

The DownloadProgress message is used to notify remote devices about partial availability of files. By default, these messages are sent every 5 seconds, and only in the cases where progress or state changes have been detected. Each DownloadProgress message is addressed to a specific folder and MUST contain zero or more FileDownloadProgressUpdate messages.

#### Protocol Buffer Schema[¶](#id6 &quot;Permalink to this headline&quot;)

message DownloadProgress {
    string                              folder  &#x3D; 1;
    repeated FileDownloadProgressUpdate updates &#x3D; 2;
}

message FileDownloadProgressUpdate {
    FileDownloadProgressUpdateType update_type   &#x3D; 1;
    string                         name          &#x3D; 2;
    Vector                         version       &#x3D; 3;
    repeated int32                 block_indexes &#x3D; 4;
}

enum FileDownloadProgressUpdateType {
    APPEND &#x3D; 0;
    FORGET &#x3D; 1;
}

#### Fields (DownloadProgress Message)[¶](#fields-downloadprogress-message &quot;Permalink to this headline&quot;)

The **folder** field represents the ID of the folder for which the update is being provided.

The **updates** field is a list of progress update messages.

#### Fields (FileDownloadProgressUpdate Message)[¶](#fields-filedownloadprogressupdate-message &quot;Permalink to this headline&quot;)

The **update\_type** indicates whether the update is of type **append (0)**(new blocks are available) or **forget (1)** (the file transfer has completed or failed).

The **name** field defines the file name from the global index for which this update is being sent.

The **version** message defines the version of the file for which this update is being sent.

The **block\_indexes** field is a list of positive integers, where each integer represents the index of the block in the FileInfo message Blocks array that has become available for download.

For example an integer with value 3 represents that the data defined in the fourth BlockInfo message of the FileInfo message of that file is now available. Please note that matching should be done on **name** AND**version**. Furthermore, each update received is incremental, for example the initial update message might contain indexes 0, 1, 2, an update 5 seconds later might contain indexes 3, 4, 5 which should be appended to the original list, which implies that blocks 0-5 are currently available.

Block indexes MAY be added in any order. An implementation MUST NOT assume that block indexes are added in any specific order.

The **forget** field being set implies that previously advertised file is no longer available, therefore the list of block indexes should be truncated.

Messages with the **forget** field set MUST NOT have any block indexes.

Any update message which is being sent for a different **version** of the same file name must be preceded with an update message for the old version of that file with the **forget** field set.

As a safeguard on the receiving side, the value of **version** changing between update messages implies that the file has changed and that any indexes previously advertised are no longer available. The list of available block indexes MUST be replaced (rather than appended) with the indexes specified in this message.

### Ping[¶](#ping &quot;Permalink to this headline&quot;)

The Ping message is used to determine that a connection is alive, and to keep connections alive through state tracking network elements such as firewalls and NAT gateways. A Ping message is sent every 90 seconds, if no other message has been sent in the preceding 90 seconds.

#### Protocol Buffer Schema[¶](#id7 &quot;Permalink to this headline&quot;)

### Close[¶](#close &quot;Permalink to this headline&quot;)

The Close message MAY be sent to indicate that the connection will be torn down due to an error condition. A Close message MUST NOT be followed by further messages.

#### Protocol Buffer Schema[¶](#id8 &quot;Permalink to this headline&quot;)

message Close {
    string reason &#x3D; 1;
}

#### Fields[¶](#id9 &quot;Permalink to this headline&quot;)

The **reason** field contains a human readable description of the error condition.

## Sharing Modes[¶](#sharing-modes &quot;Permalink to this headline&quot;)

### Trusted[¶](#trusted &quot;Permalink to this headline&quot;)

Trusted mode is the default sharing mode. Updates are exchanged in both directions.

+------------+     Updates      &#x2F;---------\
|            |  -----------&gt;   &#x2F;           \
|   Device   |                 |  Cluster  |
|            |  &lt;-----------   \           &#x2F;
+------------+     Updates      \---------&#x2F;

### Send Only[¶](#send-only &quot;Permalink to this headline&quot;)

In send only mode, a device does not apply any updates from the cluster, but publishes changes of its local folder to the cluster as usual.

+------------+     Updates      &#x2F;---------\
|            |  -----------&gt;   &#x2F;           \
|   Device   |                 |  Cluster  |
|            |                 \           &#x2F;
+------------+                  \---------&#x2F;

### Receive Only[¶](#receive-only &quot;Permalink to this headline&quot;)

In receive only mode, a device does not send any updates to the cluster, but accepts changes to its local folder from the cluster as usual.

+------------+     Updates      &#x2F;---------\
|            |  &lt;-----------   &#x2F;           \
|   Device   |                 |  Cluster  |
|            |                 \           &#x2F;
+------------+                  \---------&#x2F;

## Delta Index Exchange[¶](#delta-index-exchange &quot;Permalink to this headline&quot;)

Index data must be exchanged whenever two devices connect so that one knows the files available on the other. In the most basic case this happens by way of sending an &#x60;Index&#x60; message followed by one or more &#x60;Index Update&#x60;messages. Any previous index data known for a remote device is removed and replaced with the new index data received in an &#x60;Index&#x60; message, while the contents of an &#x60;Index Update&#x60; message is simply added to the existing index data.

For situations with large indexes or frequent reconnects this can be quite inefficient. A mechanism can then be used to retain index data between connections and only transmit any changes since that data on connection start. This is called “delta indexes”. To enable this mechanism the**sequence** and **index ID** fields are used.

Sequence:

Each index item (i.e., file, directory or symlink) has a sequence number field. It contains the value of a counter at the time the index item was updated. The counter increments by one for each change. That is, as files are scanned and added to the index they get assigned sequence numbers 1, 2, 3 and so on. The next file to be changed or detected gets sequence number 4, and future updates continue in the same fashion.

Index ID:

Each folder has an Index ID. This is a 64 bit random identifier set at index creation time.

Given the above, we know that the tuple {index ID, maximum sequence number} uniquely identifies a point in time of a given index. Any further changes will increase the sequence number of some item, and thus the maximum sequence number for the index itself. Should the index be reset or removed (i.e., the sequence number reset to zero), a new index ID must be generated.

By letting a device know the {index ID, maximum sequence number} we have for their index data, that device can arrange to only transmit &#x60;Index Update&#x60;messages for items with a higher sequence number. This is the delta index mechanism.

The index ID and maximum sequence number known for each device is transmitted in the &#x60;Cluster Config&#x60; message at connection start.

For this mechanism to be reliable it is essential that outgoing index information is ordered by increasing sequence number. Devices announcing a non-zero index ID in the &#x60;Cluster Config&#x60; message MUST send all index data ordered by increasing sequence number. Devices not intending to participate in delta index exchange MUST send a zero index ID or, equivalently, not send the &#x60;index_id&#x60; attribute at all.

## Message Limits[¶](#message-limits &quot;Permalink to this headline&quot;)

An implementation MAY impose reasonable limits on the length of messages and message fields to aid robustness in the face of corruption or broken implementations. An implementation should strive to keep messages short and to the point, favouring more and smaller messages over fewer and larger. For example, favour a smaller Index message followed by one or more Index Update messages rather than sending a very large Index message.

The Syncthing implementation imposes a hard limit of 500,000,000 bytes on all messages. Attempting to send or receive a larger message will result in a connection close. This size was chosen to accommodate Index messages containing a large block list. It’s intended that the limit may be further reduced in a future protocol update supporting variable block sizes (and thus shorter block lists for large files).

## Selection of Block Size[¶](#selection-of-block-size &quot;Permalink to this headline&quot;)

The desired block size for any given file is the smallest block size that results in fewer than 2000 blocks, or the maximum block size for larger files. This rule results in the following table of block sizes per file size:

| File Size         | Block Size |
| ----------------- | ---------- |
| 0 - 250 MiB       | 128 KiB    |
| 250 MiB - 500 MiB | 256 KiB    |
| 500 MiB - 1 GiB   | 512 KiB    |
| 1 GiB - 2 GiB     | 1 MiB      |
| 2 GiB - 4 GiB     | 2 MiB      |
| 4 GiB - 8 GiB     | 4 MiB      |
| 8 GiB - 16 GiB    | 8 MiB      |
| 16 GiB - up       | 16 MiB     |

An implementation MAY deviate from the block size rule when there is good reason to do so. For example, if a file has been indexed at a certain block size and grows beyond 2000 blocks it may be retained at the current block size for practical reasons. When there is no overriding reason to the contrary, such as when indexing a new file for the first time, the block size rule above SHOULD be followed.

An implementation MUST therefore accept files with a block size differing from the above rule. This does not mean that arbitrary block sizes are allowed. The block size used MUST be exactly one of the power-of-two block sizes listed in the table above.

## Example Exchange[¶](#example-exchange &quot;Permalink to this headline&quot;)

| #  | A                      | B                      |
| -- | ---------------------- | ---------------------- |
| 1  | ClusterConfiguration-&gt; | &lt;-ClusterConfiguration |
| 2  | Index-&gt;                | &lt;-Index                |
| 3  | IndexUpdate-&gt;          | &lt;-IndexUpdate          |
| 4  | IndexUpdate-&gt;          |                        |
| 5  | Request-&gt;              |                        |
| 6  | Request-&gt;              |                        |
| 7  | Request-&gt;              |                        |
| 8  | Request-&gt;              |                        |
| 9  | &lt;-Response             |                        |
| 10 | &lt;-Response             |                        |
| 11 | &lt;-Response             |                        |
| 12 | &lt;-Response             |                        |
| 13 | Index Update-&gt;         |                        |
| …  |                        |                        |
| 14 | &lt;-Ping                 |                        |
| 15 | Ping-&gt;                 |                        |

The connection is established and at 1\. both peers send ClusterConfiguration messages and then Index records. The Index records are received and both peers recompute their knowledge of the data in the cluster. In this example, peer A has four missing or outdated blocks. At 5 through 8 peer A sends requests for these blocks. The requests are received by peer B, who retrieves the data from the folder and transmits Response records (9 through 12). Device A updates their folder contents and transmits an Index Update message (13). Both peers enter idle state after 13\. At some later time 14, the ping timer on device B expires and a Ping message is sent. The same process occurs for device A at 15.

## Examples of Strong Cipher Suites[¶](#examples-of-strong-cipher-suites &quot;Permalink to this headline&quot;)

| ID     | Name                        | Description                       |
| ------ | --------------------------- | --------------------------------- |
| 0x009F | DHE-RSA-AES256-GCM-SHA384   | TLSv1.2 DH RSA AESGCM(256) AEAD   |
| 0x006B | DHE-RSA-AES256-SHA256       | TLSv1.2 DH RSA AES(256) SHA256    |
| 0xC030 | ECDHE-RSA-AES256-GCM-SHA384 | TLSv1.2 ECDH RSA AESGCM(256) AEAD |
| 0xC028 | ECDHE-RSA-AES256-SHA384     | TLSv1.2 ECDH RSA AES(256) SHA384  |
| 0x009E | DHE-RSA-AES128-GCM-SHA256   | TLSv1.2 DH RSA AESGCM(128) AEAD   |
| 0x0067 | DHE-RSA-AES128-SHA256       | TLSv1.2 DH RSA AES(128) SHA256    |
| 0xC02F | ECDHE-RSA-AES128-GCM-SHA256 | TLSv1.2 ECDH RSA AESGCM(128) AEAD |
| 0xC027 | ECDHE-RSA-AES128-SHA256     | TLSv1.2 ECDH RSA AES(128) SHA256  |