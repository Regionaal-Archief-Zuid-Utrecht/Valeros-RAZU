##
# Cantaloupe delegate script for the local demo.
#
# IIIF identifiers use "__" as escaped "/" separator, e.g.
#   k50907905__nl-wbdrazu__k50907905__689__000__116__nl-wbdrazu-k50907905-689-116204.jpg
# which maps to bucket "k50907905" and object key
#   nl-wbdrazu/k50907905/689/000/116/nl-wbdrazu-k50907905-689-116204.jpg
##
class CustomDelegate
  attr_accessor :context

  def s3source_object_info(options = {})
    {
      'bucket' => 'k50907905',
      'key' => context['identifier'].gsub('__', '/').sub(%r{^k50907905/}, ''),
    }
  end

  def pre_authorize(options = {})
    true
  end

  def authorize(options = {})
    true
  end

  def method_missing(name, *args)
  end
end
