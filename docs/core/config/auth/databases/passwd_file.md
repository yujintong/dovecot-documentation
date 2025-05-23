---
layout: doc
title: Passwd-file
dovecotlinks:
  auth_passwd_file: passwd-file authentication database
---

# Passwd-file (`passwd-file`)

This file is compatible with a normal `/etc/passwd` file, and a password file
used by [[link,auth_pam,libpam-pwdfile]] plugin.

## Configuration

`user:password:uid:gid:(gecos):home:(shell):extra_fields`

For a [[link,passdb]] it's enough to have only the user and password fields.

For a [[link,userdb]], you need to set also uid, gid, and preferably also home
[[link,virtual_users]]). (gecos) and (shell) fields are unused by Dovecot.

The password field can be in four formats (see [[link,password_schemes]]):

* `password`: Assume [[setting,passdb_default_password_scheme]] (CRYPT)
  password scheme. See [[link,password_schemes]].
* `{SCHEME}password`: The password is in the given scheme.
* `password[13]`: libpam-passwd file compatible format for CRYPT scheme.
* `password[34]`: libpam-passwd file compatible format for MD5 scheme.

`extra_fields` is a space-separated list of `key=value` pairs which can be
used to set various [[link,passdb_extra_fields]] and
[[link,userdb_extra_fields]].

Keys which begin with a `userdb_ prefix` are used for userdb, others are
used for passdb.

For example, if you wish to override [[setting,mail_path]] for one use,
use `userdb_mail_path=~/mail`.

[[variable]] expansion is done for `extra_fields`.

Empty lines and lines beginning with `#` character are ignored.

### Settings

<SettingsComponent tag="passwd-file" />

Also global settings that are commonly overridden inside the passdb filter:

* [[setting,passdb_default_password_scheme]] specifies the default password
  scheme to be used in the passwd-files.
* [[setting,auth_username_format]] changes the username that is looked up from
  the passwd-file. For example `auth_username_format = %{protocol}` can be used
  to lookup the current protocol instead of the username.

### Multiple passwd-files

You can use all [[variable]] in the passwd-file filenames, for example:

```[dovecot.conf]
passdb passwd-file {
  # Each domain has a separate passwd-file:
  passwd_file_path = /etc/auth/%{user | domain}/passwd
}
```

[[added,passwd_file_iteration]]
To iterate databases that use [[variable]] expansion in the path, you need to provide enough information when using
e.g. [[doveadm,user]] to iterate. For example [[doveadm,user,*@domain.com]] would match with ``%{user | domain}`` expansion in
the above example, and [[doveadm,user,*]] would iterate `/etc/auth/passwd` if available.
This iteration works with all doveadm mail commands similarly.

### Variables

[[setting,passdb_fields]] and [[setting,userdb_fields]] can use
`%{passwd_file:<field>}` variables to access the current passdb or
userdb lookup's fields. The available fields are:

* `uid`
* `gid`
* `home`
* Any specified extra fields. The `userdb_` prefixed fields are available also
  in passdb lookups with the `userdb_` prefix. In userdb lookups these same
  fields are available without the `userdb_` prefix.

### Examples

```[dovecot.conf]
passdb passwd-file {
  default_password_scheme = plain-md5
  auth_username_format = %{user | username}
  passwd_file_path = /etc/imap.passwd
}
userdb passwd-file {
  auth_username_format = %{user | username}
  passwd_file_path = /etc/imap.passwd
  fields {
    uid:default = vmail
    gid:default = vmail
    home:default = /home/vmail/%{user}
  }
}
```

* The `fields` is explained in [[setting,userdb_fields]]. They
  can be used to provide userdb extra fields based on templates. If you leave
  any of the standard userdb fields (uid, gid, home) empty in the passwd file,
  these defaults will be used. If you leave out the `:default` suffix, they
  override the passwd file fields.

This file can be used as a passdb:

```
user:{plain}password
user2:{plain}password2
```

A passdb with extra fields:

```
user:{plain}password::::::allow_nets=192.168.0.0/24
```

This file can be used as both a passwd and a userdb:

```
user:{plain}pass:1000:1000::/home/user::userdb_mail_path=~/Maildir allow_nets=192.168.0.0/24
user2:{plain}pass2:1001:1001::/home/user2
```

## FreeBSD /etc/master.passwd as passdb and userdb

On FreeBSD, `/etc/passwd` doesn't work as a password database because the
password field is replaced by a `*`.

`/etc/master.passwd` can be converted into a format usable by passwd-file.
As [[link,auth_pam]] can access the system-wide credentials on FreeBSD,
what follows is generally needed only if the mail accounts are different
from the system accounts.

If only using the result for `name:password:uid:gid` and not using
[[link,passdb_extra_fields]], you may be able to use the extract directly.
However, the Linux-style passwd file has fewer fields than that used by
FreeBSD and it will need to be edited if any fields past the first four are
needed.

In particular, it will fail if used directly as a `userdb` as the field used
for `home` is not in the same place as expected by the Dovecot parser. The
`:class:change:expire` stanza in each line should be removed to be consistent
with the Linux-style format. While that stanza often is `::0:0` use of
`cut` is likely much safer than sed or other blind substitution.

In `/etc/master.passwd`, a password of `* ` indicates that password
authentication is disabled for that user and the token `*LOCKED*` prevents
all login authentication, so you might as well exclude those:

```sh
fgrep -v '*' /etc/master.passwd | cut -d : -f 1-4,8-10 > /path/to/file-with-encrypted-passwords
chmod 640 /path/to/file-with-encrypted-passwords
chown root:dovecot /path/to/file-with-encrypted-passwords
```

The following will work in many situations, after disabling the inclusion of
other `userdb` and `passdb` sections:

```
passdb passwd-file {
  auth_username_format = %{user | username}
  passwd_file_path = /path/to/file-with-encrypted-passwords
}

userdb passwd-file {
  auth_username_format = %{user | username}
  passwd_file_path = /path/to/file-with-encrypted-passwords
}
```
