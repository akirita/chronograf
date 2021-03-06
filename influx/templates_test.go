package influx

import (
	"testing"

	"github.com/influxdata/chronograf"
)

func TestTemplateReplace(t *testing.T) {
	tests := []struct {
		name  string
		query string
		vars  []chronograf.TemplateVar
		want  string
	}{
		{
			name:  "select with parameters",
			query: "$METHOD field1, $field FROM $measurement WHERE temperature > $temperature",
			vars: []chronograf.TemplateVar{
				{
					Var: "$temperature",
					Values: []chronograf.TemplateValue{
						{
							Type:  "csv",
							Value: "10",
						},
					},
				},
				{
					Var: "$field",
					Values: []chronograf.TemplateValue{
						{
							Type:  "fieldKey",
							Value: "field2",
						},
					},
				},
				{
					Var: "$METHOD",
					Values: []chronograf.TemplateValue{
						{
							Type:  "csv",
							Value: "SELECT",
						},
					},
				},
				{
					Var: "$measurement",
					Values: []chronograf.TemplateValue{
						{
							Type:  "csv",
							Value: `"cpu"`,
						},
					},
				},
			},
			want: `SELECT field1, "field2" FROM "cpu" WHERE temperature > 10`,
		},
		{
			name:  "select with parameters and aggregates",
			query: `SELECT mean($field) FROM "cpu" WHERE $tag = $value GROUP BY $tag`,
			vars: []chronograf.TemplateVar{
				{
					Var: "$value",
					Values: []chronograf.TemplateValue{
						{
							Type:  "tagValue",
							Value: "howdy.com",
						},
					},
				},
				{
					Var: "$tag",
					Values: []chronograf.TemplateValue{
						{
							Type:  "tagKey",
							Value: "host",
						},
					},
				},
				{
					Var: "$field",
					Values: []chronograf.TemplateValue{
						{
							Type:  "fieldKey",
							Value: "field",
						},
					},
				},
			},
			want: `SELECT mean("field") FROM "cpu" WHERE "host" = 'howdy.com' GROUP BY "host"`,
		},
		{
			name:  "Non-existant parameters",
			query: `SELECT $field FROM "cpu"`,
			want:  `SELECT $field FROM "cpu"`,
		},
		{
			name:  "var without a value",
			query: `SELECT $field FROM "cpu"`,
			vars: []chronograf.TemplateVar{
				{
					Var: "$field",
				},
			},
			want: `SELECT $field FROM "cpu"`,
		},
		{
			name:  "var with unknown type",
			query: `SELECT $field FROM "cpu"`,
			vars: []chronograf.TemplateVar{
				{
					Var: "$field",
					Values: []chronograf.TemplateValue{
						{
							Type:  "who knows?",
							Value: "field",
						},
					},
				},
			},
			want: `SELECT $field FROM "cpu"`,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := TemplateReplace(tt.query, tt.vars)
			if got != tt.want {
				t.Errorf("TestParse %s =\n%s\nwant\n%s", tt.name, got, tt.want)
			}
		})
	}
}
