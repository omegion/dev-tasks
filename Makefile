.PHONY: release-tag
release-tag:
	git checkout master & git pull
	git tag v$(version)
	git push origin v$(version)