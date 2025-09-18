#!/usr/bin/env sh
# load-env.sh
# Usage:  source ./load-env.sh path/to/.env
# This script must be sourced to export variables into the current shell.

# Better sourcing check
if [ "$0" = "$BASH_SOURCE" ]; then
    echo "Error: This script should be sourced, not executed directly" >&2
    echo "Usage: source $0 <env-file>" >&2
    exit 1
fi

if [ "$#" -ne 1 ]; then
    echo "Usage: source $0 <env-file>" >&2
    return 1 2>/dev/null || exit 1
fi

ENV_FILE="$1"

if [ ! -f "$ENV_FILE" ]; then
    echo "Env file not found: $ENV_FILE" >&2
    return 1 2>/dev/null || exit 1
fi

# Load file line-by-line
while IFS= read -r line || [ -n "$line" ]; do
    # trim leading/trailing whitespace
    trimmed=$(printf '%s' "$line" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')

    # skip empty lines and comments
    case "$trimmed" in
        ''|\#*) continue;;
    esac

    # remove optional leading 'export '
    trimmed=${trimmed#"export "}

    # split at first '='
    if ! echo "$trimmed" | grep -q '='; then
        continue
    fi

    key=${trimmed%%=*}
    value=${trimmed#*=}

    # trim whitespace from key
    key=$(printf '%s' "$key" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')

    # handle quoted values
    case "$value" in
        \"*)
            # double-quoted value: remove surrounding quotes
            value=${value#\"}
            value=${value%\"}
            ;;
        \'*)
            # single-quoted value
            value=${value#\'}
            value=${value%\'}
            ;;
        *)
            # unquoted: remove inline comment after '#'
            value=$(printf '%s' "$value" | sed -e 's/[[:space:]]*#.*$//')
            ;;
    esac

    # remove trailing CR if present (Windows CRLF)
    value=$(printf '%s' "$value" | tr -d '\r')

    # ensure valid identifier (more comprehensive check)
    case "$key" in
        [a-zA-Z_]*[a-zA-Z0-9_]*)
            export "$key=$value"
            ;;
        *)
            echo "Warning: Invalid variable name '$key' skipped" >&2
            continue
            ;;
    esac
done < "$ENV_FILE"

echo "Environment variables loaded from $ENV_FILE"
return 0 2>/dev/null || exit 0
