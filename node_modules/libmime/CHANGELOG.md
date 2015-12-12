# Changelog

## v1.2.0 2015-10-05

Added support for emojis in header params (eg. filenames)

## v1.1.0 2015-09-24

Updated encoded word encoding with quoted printable, should be more like required in https://tools.ietf.org/html/rfc2047#section-5

## v1.0.0 2015-04-15

Changed versioning scheme to use 1.x instead of 0.x versions. Bumped dependency versions, no actual code changes.

## v0.1.7 2015-01-19

Updated unicode filename handling – only revert to parameter continuation if the value actually includes
non-ascii characters or is too long. Previously filenames were encoded if they included anything
besides letters, numbers, dot or space.

## v0.1.6 2014-10-25

Fixed an issue with `encodeWords` where a trailing space was invalidly included in a word if the word
ended with an non-ascii character.

## v0.1.5 2014-09-12

Do not use quotes for continuation encoded filename parts. Fixes an issue with Gmail where the Gmail webmail keeps the charset as part of the filename.